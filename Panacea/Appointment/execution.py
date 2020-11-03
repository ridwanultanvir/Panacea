from json import decoder
import cx_Oracle
import hashlib

from django.http import response
from UserHandler.execution import connect


def getAllDepartments():
    cursor = connect().cursor()

    try:
        cursor.execute("SELECT DISTINCT(DEPARTMENT) FROM PANACEA.DOCTOR")

        result = cursor.fetchall()
        departments = []
        if(len(result) > 0):
            for dept in result:
                departments.append(dept[0])
        response = {'success': True, 'errorMessage': '',
                    'departments': departments}
        print(response)
        return response
    except cx_Oracle.Error as error:
        response = {'success': False, 'errorMessage': error}
        print(response)
        return response


def getAllDoctorsInADeptartment(deptName):
    cursor = connect().cursor()

    try:
        cursor.execute(
            f"SELECT P.ID, (P.FIRST_NAME || ' ' || P.LAST_NAME)  AS NAME, D.DESIGNATION, D.QUALIFICATION FROM PERSON P JOIN DOCTOR D ON(P.ID = D.ID) WHERE D.DEPARTMENT = '{deptName}'")
        result = cursor.fetchall()
        doctorsName = []

        if(len(result) > 0):
            for doctor in result:
                doctorsName.append(
                    {'id': doctor[0], 'name': doctor[1], 'designation': doctor[2], 'qualification': doctor[3]})
        response = {'success': True, 'errorMessage': '',
                    'doctors': doctorsName}
        return response
    except cx_Oracle.Error as error:
        response = {'success': False, 'errorMessage': error}
        print(response)
        return response


def getScheduleOfDoctor(docID):
    cursor = connect().cursor()

    query = '''SELECT S.SCHEDULE_ID, TO_CHAR(S.SCHEDULE_DATE, 'MM-DD-YYYY') as "DATE",  T.START_TIME, T.END_TIME, T.SHIFT_TITLE
                FROM SCHEDULE S JOIN TIME_TABLE T ON(S.TIME_ID = T.TIME_ID)
                WHERE TO_DATE(TO_CHAR(S.SCHEDULE_DATE, 'MM-DD-YYYY') || ' ' || T.END_TIME, 'MM-DD-YYYY HH24:MI:SS' )- (1/24) > SYSDATE
                AND S.ID = :docID
                AND 15 > (SELECT COUNT(*)
					      FROM APPOINTMENT A
					      RIGHT OUTER JOIN SCHEDULE S1 ON(A.SCHEDULE_ID = S1.SCHEDULE_ID)
					      GROUP BY S1.SCHEDULE_ID
					      HAVING S1.SCHEDULE_ID = S.SCHEDULE_ID)
                AND (T.TIME_ID = 6 OR T.TIME_ID = 7)'''

    try:
        cursor.execute(query, [docID])
        result = cursor.fetchall()

        scheduleData = []
        if(len(result) > 0):
            for schedule in result:
                scheduleData.append({'schedule_id': schedule[0], 'schedule_date': schedule[1],
                                     'start_time': schedule[2], 'end_time': schedule[3], 'shift_title': schedule[4]})

        response = {'success': True, 'errorMessage': '',
                    'scheduleData': scheduleData}
        print(response)
        return response
    except cx_Oracle.Error as error:
        response = {'success': False, 'errorMessage': error}
        print(response)
        return response


def checkScheduleForPatient(patientID, scheduleID):
    cursor = connect().cursor()

    query = '''SELECT COUNT(*) FROM APPOINTMENT
                WHERE PATIENT_ID = (SELECT ID FROM PANACEA.PERSON WHERE USER_ID = :patientID)
                AND SCHEDULE_ID IN (SELECT SCHEDULE_ID 
									FROM SCHEDULE
									WHERE ID = (SELECT ID FROM SCHEDULE WHERE SCHEDULE_ID = :scheduleID)
									AND SCHEDULE_DATE = (SELECT SCHEDULE_DATE FROM SCHEDULE WHERE SCHEDULE_ID = :scheduleID))'''

    try:
        cursor.execute(query, [patientID, scheduleID, scheduleID])
        result = cursor.fetchone()

        query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "NAME" 
                    FROM PANACEA.PERSON P JOIN PANACEA.SCHEDULE S ON(S.ID = P.ID)
                    WHERE S.SCHEDULE_ID = :scheduleID'''

        cursor.execute(query, [scheduleID])
        docName = cursor.fetchone()[0]

        print(result)
        if result[0] > 0:
            response = {
                'success': False, 'errorMessage': 'You already have an appointment with Dr. ' + docName + ' on the selected date'}

        else:
            response = {'success': True, 'errorMessage': ''}

        return response

    except cx_Oracle.Error as error:
        response = {'success': False, 'errorMessage': error}
        print(response)
        return response


def saveAppointment(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}
    if(data['newPatient']):
        patientInfo = data['patientInfo']
        appointmentInfo = data['appointmentInfo']
        print(patientInfo['dateOfBirth'])

        try:
            query = "SELECT 'P25' || TO_CHAR(TO_NUMBER(SUBSTR(MAX(USER_ID), 4)) + 1) AS NEW_ID FROM PANACEA.PERSON WHERE USER_ID LIKE 'P25%'"

            cursor.execute(query)
            result = cursor.fetchone()
            newUserId = result[0]

            query = '''SELECT ID, USER_ID FROM PANACEA.PERSON
                        WHERE FIRST_NAME = :firstName
                        AND LAST_NAME = :lastName
                        AND EMAIL = :email'''
            cursor.execute(query, [patientInfo['firstName'],
                                   patientInfo['lastName'], patientInfo['email']])
            result = cursor.fetchall()
            print(result)
            if(len(result) > 0):
                ID = result[0][0]
                response['message'] = 'You were already registered before. Please sign in with previous user id to see details of the appointment'

                query = '''
                INSERT INTO PANACEA.APPOINTMENT(APP_SL_NO, PATIENT_ID, DOCTOR_ID, APPNT_DATE,PROB_DESC, STATUS, SCHEDULE_ID)
                VALUES((SELECT MAX(APP_SL_NO) FROM APPOINTMENT) + 1, :id, :docId,SYSDATE,:problemDescription,'pending', :scheduleId)
                '''

                cursor.execute(
                    query, [ID, appointmentInfo['docId'], appointmentInfo['problemDescription'], appointmentInfo['scheduleId']])
                connection.commit()
                print('duplicate')
                response['success'] = True
                response['errorMessage'] = ''
                return response
            else:
                query = '''
                DECLARE
                    NEW_USER_ID VARCHAR2(15);
                    NEW_PASSWORD VARCHAR2(50);
                    NEW_ID NUMBER(10,0);
                BEGIN
                    SELECT 'P25' || TO_CHAR(TO_NUMBER(SUBSTR(MAX(USER_ID), 4)) + 1)
                    INTO NEW_USER_ID
                    FROM PANACEA.PERSON
                    WHERE USER_ID LIKE 'P25%';

                    NEW_PASSWORD := dbms_crypto.hash(utl_raw.cast_to_raw(NEW_USER_ID), dbms_crypto.HASH_MD5);

                    INSERT INTO PANACEA.PERSON(USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUM, GENDER, ADDRESS,DATE_OF_BIRTH, PASSWORD)
                    VALUES(NEW_USER_ID, :firstName, :lastName, :email, :phoneNumber, :gender, :address,TO_DATE(:dateOfBirth, 'DD-MM-YYYY') ,NEW_PASSWORD );

                    SELECT ID
                    INTO NEW_ID
                    FROM PANACEA.PERSON
                    WHERE USER_ID = NEW_USER_ID;

                    INSERT INTO PANACEA.PATIENT(ID, BIO, ID_STATUS)
                    VALUES(NEW_ID, :bio, 'TP');

                END;
                '''

                cursor.execute(query, [patientInfo['firstName'], patientInfo['lastName'], patientInfo['email'],
                                       patientInfo['phoneNumber'], patientInfo['gender'], patientInfo['address'], patientInfo['dateOfBirth'], patientInfo['bio']])
                connection.commit()
                print('not duplicate')

                query = '''
                INSERT INTO PANACEA.APPOINTMENT(APP_SL_NO, PATIENT_ID, DOCTOR_ID, APPNT_DATE,PROB_DESC, STATUS, SCHEDULE_ID)
                VALUES((SELECT MAX(APP_SL_NO) FROM APPOINTMENT) + 1, (SELECT ID FROM PERSON WHERE USER_ID = :newUserID), :docId,SYSDATE,:problemDescription,'pending', :scheduleId)
                '''

                cursor.execute(
                    query, [newUserId, appointmentInfo['docId'], appointmentInfo['problemDescription'], appointmentInfo['scheduleId']])
                connection.commit()

                response['message'] = f"Sign in to you account with user id = {newUserId} and password = {newUserId} to see the appointment details"
                response['success'] = True
                response['errorMessage'] = ''
                return response
        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response

    else:
        patientInfo = data['patientInfo']
        appointmentInfo = data['appointmentInfo']
        print(appointmentInfo)

        try:
            query = '''
                INSERT INTO PANACEA.APPOINTMENT(APP_SL_NO, PATIENT_ID, DOCTOR_ID, APPNT_DATE,PROB_DESC, STATUS, SCHEDULE_ID)
                VALUES((SELECT MAX(APP_SL_NO) FROM APPOINTMENT) + 1, (SELECT ID FROM PERSON WHERE USER_ID = :userId), :docId,SYSDATE,:problemDescription,'pending', :scheduleId)
            '''

            cursor.execute(query, [patientInfo['patientUserId'],  appointmentInfo['docId'],
                                   appointmentInfo['problemDescription'], appointmentInfo['scheduleId']])
            connection.commit()

            response['message'] = 'Appointment was submitted successfully'
            response['success'] = True
            response['errorMessage'] = ''
            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response
