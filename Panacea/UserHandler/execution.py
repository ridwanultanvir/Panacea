from json import decoder
import cx_Oracle
import hashlib

from django.http import response


def connect(user_n='PANACEA', pass_n='panacea', host='localhost', port='1521', service_n='ORCL'):
    dsn_tns = cx_Oracle.makedsn(host, port, service_name=service_n)
    conn = cx_Oracle.connect(user=user_n, password=pass_n, dsn=dsn_tns)

    return conn


def passwordHash(password):
    result = hashlib.md5(password.encode())
    return result.hexdigest()


'''the following two functions needs to be implemented'''


def verifyToken(userID, token):
    if userID != None and token != None:
        return True
    else:
        return False


def generateToken(userID):
    return 'token'


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

    query = "SELECT PASSWORD FROM PANACEA.PERSON WHERE USER_ID = :user_id"
    cursor.execute(query, [userId])

    result = cursor.fetchone()[0]
    if result == passwordHash(password):
        print('logged in')
        response = {}
        response['errorMessage'] = ''
        response['token'] = generateToken(userId)
        print(response)
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

    query = "SELECT PASSWORD FROM PANACEA.PERSON WHERE USER_ID = :user_id"
    cursor.execute(query, [userId])
    result = cursor.fetchone()[0]
    if result == passwordHash(password):
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
