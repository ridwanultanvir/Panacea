from json import decoder
import cx_Oracle
import hashlib

from django.http import response
from UserHandler.execution import connect


def getScheduleTable(docUserID):
    connection = connect()
    cursor = connection.cursor()
    if docUserID != None:
        query = '''SELECT * FROM PANACEA.PERSON WHERE USER_ID = :docUserID'''
        cursor.execute(query, [docUserID])
        result = cursor.fetchone()
        if result == None:
            response = {}
            response['success'] = False
            response['errorMessage'] = "Invalid doctor's ID"
            response['docData'] = None
            response['scheduleData'] = None
            return response
        else:
            query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME,D.DEPARTMENT, D.DESIGNATION,D.QUALIFICATION,
                        S.SCHEDULE_ID, TO_CHAR(S.SCHEDULE_DATE) AS "DATE",
                        T.START_TIME, T.END_TIME, T.SHIFT_TITLE
                        FROM PANACEA.PERSON P JOIN PANACEA.DOCTOR D ON(P.ID = D.ID)
                        LEFT OUTER JOIN PANACEA.SCHEDULE S ON(P.ID = S.ID)
                        LEFT OUTER JOIN PANACEA.TIME_TABLE T ON(S.TIME_ID = T.TIME_ID)
                        WHERE P.USER_ID = :docUserID
                        ORDER BY S.SCHEDULE_DATE DESC'''

            cursor.execute(query, [docUserID])
            result = cursor.fetchall()
            # print(result)

            docData = {
                'name': result[0][0],
                'department': result[0][1],
                'designation': result[0][2],
                'qualification': result[0][3]
            }
            scheduleData = []
            for i in range(len(result)):
                scheduleData.append({'SCHEDULE_ID': result[i][4], 'SCHEDULE_DATE': result[i][5],
                                     'START_TIME': result[i][6], 'END_TIME': result[i][7], 'SHIFT_TITLE': result[i][8]})
            # print(scheduleData)
            response = {}
            response['success'] = True
            response['errorMessage'] = None
            response['docData'] = docData
            response['scheduleData'] = scheduleData
            return response
    else:
        response = {}
        response['success'] = False
        response['errorMessage'] = "Please insert a doctor's ID"
        response['docData'] = None
        response['scheduleData'] = None
        return response


def deleteSchedule(selectedSchedules, docID):
    connection = connect()
    cursor = connection.cursor()

    # print(selectedSchedules)
    query = '''DELETE FROM PANACEA.SCHEDULE WHERE SCHEDULE_ID = :ID'''
    cursor.executemany(query, [(i,) for i in selectedSchedules])
    connection.commit()

    return getScheduleTable(docID)


def getTimeTable():
    connection = connect()
    cursor = connection.cursor()
    query = '''SELECT * FROM PANACEA.TIME_TABLE'''

    cursor.execute(query)
    result = cursor.fetchall()
    # print(result)

    timeTableData = []
    response = {}

    if(result != None):
        for timeTable in result:
            timeTableData.append({"TIME_ID": timeTable[0], "START_TIME": timeTable[1],
                                  "END_TIME": timeTable[2], "SHIFT_TITLE": timeTable[3]})

    response['success'] = True
    response['errorMessage'] = ''
    response['timeTableData'] = timeTableData

    return response


def addSchedule(docID, timeID, date):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    query = f"SELECT * FROM PANACEA.SCHEDULE WHERE SCHEDULE_DATE = TO_DATE('{date}','dd/MM/yyyy') AND ID = (SELECT ID FROM PANACEA.PERSON WHERE USER_ID = '{docID}') AND TIME_ID = {timeID}"

    cursor.execute(query)
    result = cursor.fetchall()
    if(result != None):
        response['success'] = False
        response['errorMessage'] = 'Duplicate schedule entry. Please insert a new value'
        response['scheduleData'] = None
        response['docData'] = None
        print('ulalalalaalalala')
        return response

    query = '''INSERT INTO PANACEA.SCHEDULE(SCHEDULE_ID,SCHEDULE_DATE,ID,TIME_ID)
               VALUES(TO_NUMBER((SELECT MAX(SCHEDULE_ID) FROM SCHEDULE))+1, TO_DATE(''' + "'" + date + "'" ''', 'dd/MM/yyyy'),
               (SELECT ID FROM PERSON WHERE USER_ID = ''' + "'" + docID + "'" + ")," + str(timeID) + ")"

    cursor.execute(query)
    connection.commit()
    print(query)

    return getScheduleTable(docID)
