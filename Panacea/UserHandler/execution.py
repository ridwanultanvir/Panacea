from json import decoder
import cx_Oracle
import hashlib

from django.http import response
from django.shortcuts import resolve_url
import datetime


salt = 'sjbhvksjnfklnewrglkdfkjgnergjdfnvjhbfgjndfjvdf2985734jnr98j/74werf*/4'


def connect(user_n='PANACEA', pass_n='panacea', host='localhost', port='1521', service_n='ORCL'):
    dsn_tns = cx_Oracle.makedsn(host, port, service_name=service_n)
    conn = cx_Oracle.connect(user=user_n, password=pass_n, dsn=dsn_tns)

    return conn


def tokenHash(str):
    result = hashlib.md5(str.encode())
    return result.hexdigest()


def checkPassword(userId, password):
    connection = connect()
    cursor = connection.cursor()

    result = cursor.callfunc("CHECK_LOGIN", int, [userId, password])
    print(result)
    return result


'''the following two functions needs to be implemented'''


def verifyToken(userID, token):
    return True
    # connection = connect()
    # cursor = connection.cursor()
    # if userID != None and token != None:
    #     query = '''
    #         SELECT ROUND((SYSDATE - DATE_CREATED)*24,3) AS "HOUR" FROM SESSION_TOKEN
    #         WHERE USER_ID = :userID
    #         AND TOKEN = :token
    #     '''
    #     cursor.execute(query, [userID, token])
    #     result = cursor.fetchone()
    #     if result[0] < 12:
    #         return True
    #     else:
    #         return False
    # else:
    #     return False


def generateToken(userID):
    connection = connect()
    cursor = connection.cursor()
    datetime_object = datetime.datetime.now()
    date_time_string = datetime_object.strftime("%m/%d/%Y, %H:%M:%S")
    token = tokenHash(userID + salt + date_time_string)
    print(token)

    query = '''
    INSERT INTO SESSION_TOKEN
    VALUES((SELECT MAX(SESSION_ID) FROM SESSION_TOKEN)+1, :userID, :token, SYSDATE)
    '''

    cursor.execute(query, [userID, token])
    connection.commit()

    return token


def getUserInfoDict(result):
    info = {}
    info['name'] = result[0]
    info['email'] = result[1]
    info['phoneNum'] = result[2]
    info['image'] = result[3]
    info['gender'] = result[4]
    info['address'] = result[5]
    info['date_of_birth'] = result[6]

    return info


def login(credentials):
    cursor = connect().cursor()
    userId = credentials['userId']
    password = credentials['password']

    # query = "SELECT PASSWORD FROM PANACEA.PERSON WHERE USER_ID = :user_id"
    # cursor.execute(query, [userId])

    # checkPassword(userId, password)

    # result = cursor.fetchone()[0]
    # if result == passwordHash(password):
    if checkPassword(userId, password) == 1:
        print('logged in')
        response = {}
        response['errorMessage'] = ''
        response['token'] = generateToken(userId)
        if userId[:3] == 'D21':
            query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                        P.DATE_OF_BIRTH, D.DEPARTMENT, D.DESIGNATION, D.QUALIFICATION
                        FROM PERSON P JOIN DOCTOR D ON(P.ID = D.ID)
                        WHERE P.USER_ID = :user_id
                        '''
            cursor.execute(query, [userId])
            result = cursor.fetchone()
            docInfo = {}
            userInfo = getUserInfoDict(result)
            docInfo.update(userInfo.copy())
            docInfo['department'] = result[7]
            docInfo['designation'] = result[8]
            docInfo['qualification'] = result[9]

            response['category'] = 'doctor'
            response['userData'] = docInfo
            response['success'] = True

        elif userId[:3] == 'E28':
            query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                        P.DATE_OF_BIRTH, E.CATEGORY, E.EDUCATION, E.TRAINING, E.SALARY
                        FROM PERSON P JOIN EMPLOYEE E ON(P.ID = E.ID)
                        WHERE P.USER_ID = :user_id
                        '''
            cursor.execute(query, [userId])
            result = cursor.fetchone()
            empInfo = {}
            userInfo = getUserInfoDict(result)
            empInfo.update(userInfo.copy())
            empInfo['category'] = result[7]
            empInfo['education'] = result[8]
            empInfo['training'] = result[9]
            empInfo['salary'] = result[10]

            response['category'] = empInfo['category']
            response['userData'] = empInfo
            response['success'] = True

        elif userId[:3] == 'P25':
            query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                        P.DATE_OF_BIRTH,PT.BIO
                        FROM PERSON P JOIN PATIENT PT ON(P.ID = PT.ID)
                        WHERE P.USER_ID = :user_id
                        '''
            cursor.execute(query, [userId])
            result = cursor.fetchone()
            patientInfo = {}
            userInfo = getUserInfoDict(result)
            patientInfo.update(userInfo.copy())
            patientInfo['bio'] = result[7]

            response['category'] = 'patient'
            response['userData'] = patientInfo
            response['success'] = True

        elif userId[:3] == 'A15':
            query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                        P.DATE_OF_BIRTH
                        FROM PERSON P 
                        WHERE P.USER_ID = :user_id
                        '''
            cursor.execute(query, [userId])
            result = cursor.fetchone()
            userInfo = getUserInfoDict(result)

            response['category'] = 'admin'
            response['userData'] = userInfo
            response['success'] = True

        # print(response)
        return response

    else:
        print('incorrect password')
        response = {}
        response['errorMessage'] = 'Invalid user id or password'
        response['token'] = None
        response['userData'] = None
        response['success'] = False
        # print(response)
        return response


def getPatientData(credentials):
    cursor = connect().cursor()
    userId = credentials['userId']
    password = credentials['password']

    # query = "SELECT PASSWORD FROM PANACEA.PERSON WHERE USER_ID = :user_id"
    # cursor.execute(query, [userId])
    # result = cursor.fetchone()[0]
    # if result == passwordHash(password):
    if checkPassword(userId, password) == 1:
        print('authentic user')
        response = {}

        if userId[:3] == 'P25':
            query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                        P.DATE_OF_BIRTH,PT.BIO
                        FROM PERSON P JOIN PATIENT PT ON(P.ID = PT.ID)
                        WHERE P.USER_ID = :user_id
                        '''
            cursor.execute(query, [userId])
            result = cursor.fetchone()
            patientInfo = {}
            userInfo = getUserInfoDict(result)
            patientInfo.update(userInfo.copy())
            patientInfo['bio'] = result[7]
            response.update(patientInfo.copy())
            response['errorMessage'] = ''
            response['category'] = 'patient'
            response['success'] = True
        else:
            response['success'] = False
            response['errorMessage'] = 'Please enter your patient id'

        return response

    else:
        print('incorrect password')
        response = {}
        response['errorMessage'] = 'Invalid user id or password'
        response['token'] = None
        response['userData'] = None
        response['success'] = False
        return response


def registerPatient(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    patientInfo = data['patientInfo']
    print(patientInfo)

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
            response['message'] = f"There is already a user with the name {patientInfo['firstName']} {patientInfo['lastName']} and email {patientInfo['email']}. Please use another email address"

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

            response['message'] = f"Sign in to you account with user id = {newUserId} and password = {newUserId} to see ypur details"
            response['success'] = True
            response['errorMessage'] = ''
            return response
    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def adminAddUser(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    if data['category'] == 'doctor':
        try:
            query = '''
            SELECT 'D210' || TO_CHAR(TO_NUMBER(SUBSTR(MAX(USER_ID), 4)) + 1) AS NEW_ID FROM PANACEA.PERSON WHERE USER_ID LIKE 'D21%'
            '''

            cursor.execute(query)
            result = cursor.fetchone()
            newUserId = result[0]

            query = '''
                DECLARE
                    NEW_USER_ID VARCHAR2(15);
                    NEW_PASSWORD VARCHAR2(50);
                    NEW_ID NUMBER(10,0);
                BEGIN
                    SELECT 'D210' || TO_CHAR(TO_NUMBER(SUBSTR(MAX(USER_ID), 4)) + 1)
                    INTO NEW_USER_ID
                    FROM PANACEA.PERSON
                    WHERE USER_ID LIKE 'D21%';

                    NEW_PASSWORD := dbms_crypto.hash(utl_raw.cast_to_raw(NEW_USER_ID), dbms_crypto.HASH_MD5);

                    INSERT INTO PANACEA.PERSON(USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUM, GENDER, ADDRESS,DATE_OF_BIRTH, PASSWORD)
                    VALUES(NEW_USER_ID, :firstName, :lastName, :email, :phoneNumber, :gender, :address,TO_DATE(:dateOfBirth, 'DD-MM-YYYY') ,NEW_PASSWORD );

                    SELECT ID
                    INTO NEW_ID
                    FROM PANACEA.PERSON
                    WHERE USER_ID = NEW_USER_ID;

                    INSERT INTO PANACEA.DOCTOR(ID, HIRE_DATE, DEPARTMENT, DESIGNATION, QUALIFICATION, STATUS, DEPARTMENT_HEAD_ID)
                    VALUES(NEW_ID, TO_DATE(:hire_date,'DD-MM-YYYY'), :department, :designation, :qualification,'active', :dept_head_id );

                END;
            '''
            cursor.execute(query, [data['firstName'],
                                   data['lastName'], data['email'], data['phoneNumber'], data['gender'],
                                   data['address'], data['dateOfBirth'],
                                   data['hireDate'], data['department'], data['designation'], data['qualification'],
                                   data['departmentHead']])
            connection.commit()

            response['message'] = f"New user id = {newUserId} and password = {newUserId} "
            response['success'] = True
            response['errorMessage'] = ''
            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response

    else:
        '''employee'''
        try:
            query = '''
            SELECT 'E28' || TO_CHAR(TO_NUMBER(SUBSTR(MAX(USER_ID), 4)) + 1) AS NEW_ID FROM PANACEA.PERSON WHERE USER_ID LIKE 'E28%'
            '''

            cursor.execute(query)
            result = cursor.fetchone()
            newUserId = result[0]

            query = '''
                DECLARE
                    NEW_USER_ID VARCHAR2(15);
                    NEW_PASSWORD VARCHAR2(50);
                    NEW_ID NUMBER(10,0);
                BEGIN
                    SELECT 'E28' || TO_CHAR(TO_NUMBER(SUBSTR(MAX(USER_ID), 4)) + 1)
                    INTO NEW_USER_ID
                    FROM PANACEA.PERSON
                    WHERE USER_ID LIKE 'E28%';

                    NEW_PASSWORD := dbms_crypto.hash(utl_raw.cast_to_raw(NEW_USER_ID), dbms_crypto.HASH_MD5);

                    INSERT INTO PANACEA.PERSON(USER_ID, FIRST_NAME, LAST_NAME, EMAIL, PHONE_NUM, GENDER, ADDRESS,DATE_OF_BIRTH, PASSWORD)
                    VALUES(NEW_USER_ID, :firstName, :lastName, :email, :phoneNumber, :gender, :address,TO_DATE(:dateOfBirth, 'DD-MM-YYYY') ,NEW_PASSWORD );

                    SELECT ID
                    INTO NEW_ID
                    FROM PANACEA.PERSON
                    WHERE USER_ID = NEW_USER_ID;

                    INSERT INTO PANACEA.EMPLOYEE(ID, HIRE_DATE, CATEGORY, EDUCATION, TRAINING, SALARY, COMMISSION_PCT)
                    VALUES(NEW_ID, TO_DATE(:hire_date,'DD-MM-YYYY'), :category, :education, :training, :salary, :commission_pct );

                END;
            '''
            cursor.execute(query, [data['firstName'],
                                   data['lastName'], data['email'], data['phoneNumber'], data['gender'],
                                   data['address'], data['dateOfBirth'],
                                   data['hireDate'], data['category'], data['education'], data['training'],
                                   data['salary'], data['commission']])
            connection.commit()

            response['message'] = f"New user id = {newUserId} and password = {newUserId}"
            response['success'] = True
            response['errorMessage'] = ''
            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response


def getNotification(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    try:
        query = '''
        SELECT * FROM NOTIFICATION
        WHERE USER_ID = (SELECT ID FROM PERSON WHERE USER_ID = :userID)
        ORDER BY NOTIFICATION_ID DESC
        '''

        cursor.execute(query, [data['userID']])
        result = cursor.fetchall()

        notifications = []

        for notification in result:
            notifications.append({'notification_id': notification[0], 'user_id': notification[1], 'status': notification[2],
                                  'message': notification[3]})
        response['notifications'] = notifications
        response['success'] = True
        response['errorMessage'] = ''

        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def markNotificationAsRead(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    try:
        if data['allmarked']:
            query = '''
            UPDATE NOTIFICATION SET STATUS = 'R'
            WHERE USER_ID = (SELECT ID FROM PERSON WHERE USER_ID = :userID)
            '''

            cursor.execute(query, [data['userID']])
            connection.commit()
        else:
            query = '''
            UPDATE NOTIFICATION SET STATUS = 'R'
            WHERE NOTIFICATION_ID = :notification_id
            '''
            cursor.execute(query, [data['notification_id']])
            connection.commit()

        return getNotification(data)
    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def updateUser(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}
    try:
        success = cursor.callfunc("UPDATE_USER", int, [data["userID"], data["first_name"], data["last_name"],
                                                       data["email"], data["address"], data["phoneNumber"],
                                                       data["doc_qualification"], data["pat_bio"], data["emp_education"],
                                                       data["emp_training"]])

        connection.commit()
        userId = data["userID"]
        print(success)
        if success == 1:
            if userId[:3] == 'D21':
                query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                            P.DATE_OF_BIRTH, D.DEPARTMENT, D.DESIGNATION, D.QUALIFICATION
                            FROM PERSON P JOIN DOCTOR D ON(P.ID = D.ID)
                            WHERE P.USER_ID = :user_id
                            '''
                cursor.execute(query, [userId])
                result = cursor.fetchone()
                docInfo = {}
                userInfo = getUserInfoDict(result)
                docInfo.update(userInfo.copy())
                docInfo['department'] = result[7]
                docInfo['designation'] = result[8]
                docInfo['qualification'] = result[9]

                response['userData'] = docInfo
                response['success'] = True
                response['errorMessage'] = ''
                return response

            elif userId[:3] == 'E28':
                query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                            P.DATE_OF_BIRTH, E.CATEGORY, E.EDUCATION, E.TRAINING, E.SALARY
                            FROM PERSON P JOIN EMPLOYEE E ON(P.ID = E.ID)
                            WHERE P.USER_ID = :user_id
                            '''
                cursor.execute(query, [userId])
                result = cursor.fetchone()
                empInfo = {}
                userInfo = getUserInfoDict(result)
                empInfo.update(userInfo.copy())
                empInfo['category'] = result[7]
                empInfo['education'] = result[8]
                empInfo['training'] = result[9]
                empInfo['salary'] = result[10]

                response['userData'] = empInfo
                response['success'] = True
                response['errorMessage'] = ''

                return response

            elif userId[:3] == 'P25':
                query = '''SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.IMAGE, P.GENDER, P.ADDRESS, 
                            P.DATE_OF_BIRTH,PT.BIO
                            FROM PERSON P JOIN PATIENT PT ON(P.ID = PT.ID)
                            WHERE P.USER_ID = :user_id
                            '''
                cursor.execute(query, [userId])
                result = cursor.fetchone()
                patientInfo = {}
                userInfo = getUserInfoDict(result)
                patientInfo.update(userInfo.copy())
                patientInfo['bio'] = result[7]

                response['userData'] = patientInfo
                response['success'] = True
                response['errorMessage'] = ''
                return response
        elif success == 0:
            return {'success': False, 'errorMessage': "Couldn't update your info"}

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def getDashBoardData(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    try:
        query = '''
        SELECT COUNT(A.APP_SL_NO) AS "TOTAL APPOINTMENTS", D.DEPARTMENT
        FROM APPOINTMENT A JOIN SCHEDULE S ON(A.SCHEDULE_ID = S.SCHEDULE_ID)
        JOIN PERSON P ON (A.DOCTOR_ID = P.ID)
        JOIN DOCTOR D ON (P.ID = D.ID)
        WHERE (SYSDATE - S.SCHEDULE_DATE) <= 30
        GROUP BY D.DEPARTMENT
        '''

        cursor.execute(query)
        result = cursor.fetchall()

        totalAppointments = []

        for app_no in result:
            totalAppointments.append({'dept': app_no[1], 'total': app_no[0]})

        response['totalAppointments'] = totalAppointments

        query = '''
        SELECT COUNT(DISTINCT(PATIENT_ID))
        FROM APPOINTMENT A JOIN SCHEDULE S ON(A.SCHEDULE_ID = S.SCHEDULE_ID)
        WHERE (SYSDATE - S.SCHEDULE_DATE) <= 30
        '''

        cursor.execute(query)
        result = cursor.fetchone()

        response['totalPatientsServedLast30Days'] = result[0]

        query = '''
        SELECT TO_CHAR(NVL(AP.SCHEDULE_DATE, NVL(TR.TEST_DATE, SR.SURGERY_DATE))) AS "DATE",
        NVL(AP.TOTAL_APPOINTMENTS, 0) AS "TOTAL APPOINTMENTS", NVL(TR.TOTAL_TESTS, 0) AS "TOTAL_TESTS",
        NVL(SR.TOTAL_SURGERIES,0) AS "TOTAL_SURGERIES"
        FROM
        (SELECT COUNT(*) "TOTAL_APPOINTMENTS", S.SCHEDULE_DATE
        FROM APPOINTMENT A JOIN SCHEDULE S ON(A.SCHEDULE_ID = S.SCHEDULE_ID)
        GROUP BY S.SCHEDULE_DATE) AP
        FULL JOIN
        (SELECT COUNT(*) AS "TOTAL_TESTS", TEST_DATE
        FROM TEST_RESULTS
        GROUP BY TEST_DATE
        HAVING TEST_DATE IS NOT NULL) TR 
        ON(TRUNC(AP.SCHEDULE_DATE) = TRUNC(TR.TEST_DATE))
        FULL JOIN
        (SELECT COUNT(*) AS "TOTAL_SURGERIES", SURGERY_DATE FROM SURGERY_RESULTS
        WHERE SURGERY_DATE IS NOT NULL
        GROUP BY SURGERY_DATE) SR ON(TRUNC(AP.SCHEDULE_DATE) = TRUNC(SR.SURGERY_DATE) OR TRUNC(TR.TEST_DATE) = TRUNC(SR.SURGERY_DATE))
        ORDER BY AP.SCHEDULE_DATE DESC, TR.TEST_DATE DESC, SR.SURGERY_DATE DESC
        '''

        cursor.execute(query)
        result = cursor.fetchall()

        totalActivityPerDay = []

        for actitvity in result:
            totalActivityPerDay.append(
                {'date': actitvity[0], 'total_appointments': actitvity[1], 'total_tests': actitvity[2], 'total_surgeries': actitvity[3]})

        response['totalActivityPerDay'] = totalActivityPerDay

        query = '''
        SELECT TO_CHAR(TRANSACTION_TIME),SUM(TOTAL_AMOUNT)
        FROM BILL
        GROUP BY TRANSACTION_TIME
        ORDER BY TRANSACTION_TIME DESC
        '''
        cursor.execute(query)
        result = cursor.fetchall()

        bills = []

        for bill in result:
            bills.append(
                {'transaction_date': bill[0], 'total_amount': bill[1]})

        response['bills'] = bills

        response['success'] = True
        response['errorMessage'] = ''
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response
