from json import decoder
import cx_Oracle
import hashlib


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
            docInfo['qulification'] = result[9]

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
