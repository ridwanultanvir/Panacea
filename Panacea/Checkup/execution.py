from django.http import response
from UserHandler.execution import connect
import cx_Oracle


def getDiagnosisList(app_sl_no):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    try:
        query = '''
        SELECT (P.FIRST_NAME || ' ' || P.LAST_NAME) AS NAME, P.EMAIL,P.PHONE_NUM, P.GENDER, P.ADDRESS,P.DATE_OF_BIRTH, PT.BIO
        FROM PERSON P JOIN PATIENT PT ON(P.ID = PT.ID)
        WHERE P.ID = (SELECT PATIENT_ID FROM APPOINTMENT WHERE APP_SL_NO = :app_sl_no)
        '''
        cursor.execute(query, [app_sl_no])
        result = cursor.fetchone()

        response['patient_info'] = {'name': result[0], 'email': result[1], 'phone_number': result[2], 'gender': result[3],
                                    'address': result[4], 'date_of_birth': result[5], 'bio': result[6]}

        query = '''
        SELECT SERVICE_ID, CATEGORY, SERVICE_NAME,SERVICE_DESC, COST
        FROM SERVICE
        WHERE CATEGORY = 'TEST'
        ORDER BY SERVICE_ID
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        tests = []

        for test in result:
            tests.append({'service_id': test[0], 'category': test[1],
                          'service_name': test[2], 'service_desc': test[3], 'cost': test[4]})
        # print(tests)

        response['tests'] = tests

        query = '''
        SELECT *
        FROM SERVICE
        WHERE CATEGORY = 'SURGERY'
        ORDER BY SERVICE_ID
        '''
        cursor.execute(query)
        result = cursor.fetchall()
        surgeries = []

        for surgery in result:
            surgeries.append({'service_id': surgery[0], 'category': surgery[1], 'service_name': surgery[2],
                              'service_desc': surgery[3], 'cost': surgery[4], 'department': surgery[5]})
        # print(surgeries)

        response['surgeries'] = surgeries

        response['success'] = True
        response['errorMessage'] = ''

        # print(response)
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def diagnosis(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}
    service_id = ''
    if len(data['tests']) != 0:
        for testID in data['tests']:
            if service_id == '':
                service_id = service_id + str(testID)
            else:
                service_id = service_id + '-' + str(testID)

    if len(data['surgeries']) != 0:
        for surgID in data['surgeries']:
            if service_id == '':
                service_id = service_id + str(surgID)
            else:
                service_id = service_id + '-' + str(surgID)

    if service_id == '':
        service_id = None
    else:
        service_id = f"{service_id}"
    if data['specialSurgery'] == None:
        surg_desc = None
    else:
        surg_desc = f"{data['specialSurgery']}"
    print(data)
    print(service_id)
    print(surg_desc)
    print(data['medicine'])
    print(data['diagnosisDescription'])
    try:
        cursor.callproc('INSERT_DIAGNOSIS',
                        [int(data['app_sl_no']), service_id, surg_desc, f"{data['medicine']}", f"{data['diagnosisDescription']}"])
        connection.commit()
        return {'success': True, 'errorMessage': '', 'message': 'Diagnosis added successfully'}

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def receptionistTests(data):
    connection = connect()
    cursor = connection.cursor()
    response = {}
    if(data['allTests']):
        query = '''
        SELECT C.APP_SL_NO, C.DIAGNOSIS_ID, 
        (SELECT (FIRST_NAME || ' ' || LAST_NAME) FROM PERSON WHERE ID = A.PATIENT_ID) AS "PATIENT_NAME",
        (SELECT (FIRST_NAME || ' ' || LAST_NAME) FROM PERSON WHERE ID = A.DOCTOR_ID) AS "DOCTOR_NAME", TO_CHAR(C.CHECKUP_DATE)
        FROM CHECKUP C JOIN APPOINTMENT A ON(C.APP_SL_NO = A.APP_SL_NO)
        ORDER BY C.APP_SL_NO DESC, DIAGNOSIS_ID DESC
        '''

        try:
            cursor.execute(query)
            result = cursor.fetchall()
            checkups = []

            for checkup in result:
                checkups.append({'app_sl_no': checkup[0], 'diagnosis_id': checkup[1], 'patient_name': checkup[2], 'doctor_name': checkup[3],
                                 'date': checkup[4]})

            response['tests'] = checkups
            response['success'] = True
            response['errorMessage'] = ''

            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response
    elif data['app_sl_no'] != None:
        query = '''
        SELECT C.APP_SL_NO, C.DIAGNOSIS_ID, 
        (SELECT (FIRST_NAME || ' ' || LAST_NAME) FROM PERSON WHERE ID = A.PATIENT_ID) AS "PATIENT_NAME",
        (SELECT (FIRST_NAME || ' ' || LAST_NAME) FROM PERSON WHERE ID = A.DOCTOR_ID) AS "DOCTOR_NAME", TO_CHAR(C.CHECKUP_DATE)
        FROM CHECKUP C JOIN APPOINTMENT A ON(C.APP_SL_NO = A.APP_SL_NO)
        WHERE C.APP_SL_NO = :app_sl_no
        ORDER BY DIAGNOSIS_ID DESC
        '''

        try:
            cursor.execute(query, [data['app_sl_no']])
            result = cursor.fetchall()
            checkups = []

            for checkup in result:
                checkups.append({'app_sl_no': checkup[0], 'diagnosis_id': checkup[1], 'patient_name': checkup[2], 'doctor_name': checkup[3],
                                 'date': checkup[4]})

            response['tests'] = checkups
            response['success'] = True
            response['errorMessage'] = ''

            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response

    else:
        query = '''
        SELECT C.APP_SL_NO, C.DIAGNOSIS_ID, 
        (SELECT (FIRST_NAME || ' ' || LAST_NAME) FROM PERSON WHERE ID = A.PATIENT_ID) AS "PATIENT_NAME",
        (SELECT (FIRST_NAME || ' ' || LAST_NAME) FROM PERSON WHERE ID = A.DOCTOR_ID) AS "DOCTOR_NAME", TO_CHAR(C.CHECKUP_DATE)
        FROM CHECKUP C JOIN APPOINTMENT A ON(C.APP_SL_NO = A.APP_SL_NO)
        WHERE (SYSDATE - C.CHECKUP_DATE) < 15
        ORDER BY C.APP_SL_NO DESC, DIAGNOSIS_ID DESC
        '''

        try:
            cursor.execute(query)
            result = cursor.fetchall()
            checkups = []

            for checkup in result:
                checkups.append({'app_sl_no': checkup[0], 'diagnosis_id': checkup[1], 'patient_name': checkup[2], 'doctor_name': checkup[3],
                                 'date': checkup[4]})

            response['tests'] = checkups
            response['success'] = True
            response['errorMessage'] = ''

            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response


def serviceResultsTable(diagnosisID):
    connection = connect()
    cursor = connection.cursor()
    response = {}
    try:
        query = '''
        SELECT T.TEST_RESULT_ID, S.SERVICE_NAME, S.COST
        FROM TEST_RESULTS T JOIN SERVICE S ON(T.SERVICE_ID = S.SERVICE_ID)
        WHERE T.TEST_RESULT_ID IN (select regexp_substr((SELECT SERVICE_RESULTS FROM DIAGNOSIS WHERE DIAGNOSIS_ID = :diagnosisID),'[^-]+', 1, level) AS "SERVICE_ID"
                                    from dual
                                    connect BY regexp_substr((SELECT SERVICE_RESULTS FROM DIAGNOSIS WHERE DIAGNOSIS_ID = :diagnosisID), '[^-]+', 1, level)
                                    is not null)
              AND T.COMPLETED = 'F'
        '''

        cursor.execute(query, [diagnosisID, diagnosisID])
        result = cursor.fetchall()

        pendingTests = []
        for test in result:
            pendingTests.append(
                {'test_result_id': test[0], 'service_name': test[1], 'cost': test[2]})

        response['pending_tests'] = pendingTests

        query = '''
        SELECT S.SURGERY_RESULT_ID, S.SURGERY_DESC, S1.SERVICE_NAME, S1.COST, S1.DEPARTMENT
        FROM SURGERY_RESULTS S LEFT OUTER JOIN SERVICE S1 ON(S.SERVICE_ID = S1.SERVICE_ID)
        WHERE S.SURGERY_RESULT_ID IN (select regexp_substr((SELECT SERVICE_RESULTS FROM DIAGNOSIS WHERE DIAGNOSIS_ID = :diagnosisID),'[^-]+', 1, level) AS "SERVICE_ID"
                                    from dual
                                    connect BY regexp_substr((SELECT SERVICE_RESULTS FROM DIAGNOSIS WHERE DIAGNOSIS_ID = :diagnosisID), '[^-]+', 1, level)
                                    is not null)
              AND S.COMPLETED = 'F'
        '''

        cursor.execute(query, [diagnosisID, diagnosisID])
        result = cursor.fetchall()

        pendingSurgery = []
        for surgery in result:
            pendingSurgery.append({'surgery_result_id': surgery[0], 'surgery_desc': surgery[1],
                                   'service_name': surgery[2], 'cost': surgery[3], 'department': surgery[4]})
        print(pendingSurgery)
        response['pending_surgeries'] = pendingSurgery

        response['success'] = True
        response['errorMessage'] = ''

        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def receptionistApproveTest(diagnosisID, test_result_id):
    connection = connect()
    cursor = connection.cursor()

    try:
        query = '''
        UPDATE TEST_RESULTS SET COMPLETED = 'A'
        WHERE TEST_RESULT_ID = :test_result_id
        '''
        cursor.execute(query, [test_result_id])
        connection.commit()
        return serviceResultsTable(diagnosisID)

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def receptionistApproveSurgery(diagnosisID, surgery_result_id):
    connection = connect()
    cursor = connection.cursor()

    try:
        query = '''
        UPDATE SURGERY_RESULTS SET COMPLETED = 'A'
        WHERE SURGERY_RESULT_ID = :surgery_result_id
        '''
        cursor.execute(query, [surgery_result_id])
        connection.commit()
        return serviceResultsTable(diagnosisID)

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def technicianPendingTests(data):
    connection = connect()
    cursor = connection.cursor()

    try:
        if data['all_tests']:
            query = '''
            SELECT T.TEST_RESULT_ID,S.SERVICE_NAME, (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "PATIENT NAME" 
            FROM TEST_RESULTS T JOIN SERVICE S ON(T.SERVICE_ID = S.SERVICE_ID)
            JOIN PERSON P ON(T.PATIENT_ID = P.ID)
            WHERE T.COMPLETED = 'T' OR T.COMPLETED = 'A'
            '''
            cursor.execute(query)
            result = cursor.fetchall()
        elif data['test_result_id'] != None:
            query = '''
            SELECT T.TEST_RESULT_ID,S.SERVICE_NAME, (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "PATIENT NAME" 
            FROM TEST_RESULTS T JOIN SERVICE S ON(T.SERVICE_ID = S.SERVICE_ID)
            JOIN PERSON P ON(T.PATIENT_ID = P.ID)
            WHERE T.TEST_RESULT_ID = :test_result_id AND (T.COMPLETED = 'A' OR T.COMPLETED = 'T')
            '''
            cursor.execute(query, [data['test_result_id']])
            result = cursor.fetchall()
        else:
            query = '''
            SELECT T.TEST_RESULT_ID,S.SERVICE_NAME, (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "PATIENT NAME" 
            FROM TEST_RESULTS T JOIN SERVICE S ON(T.SERVICE_ID = S.SERVICE_ID)
            JOIN PERSON P ON(T.PATIENT_ID = P.ID)
            WHERE T.COMPLETED = 'A'
            '''
            cursor.execute(query)
            result = cursor.fetchall()

        pendingTests = []

        for test in result:
            pendingTests.append(
                {'test_result_id': test[0], 'service_name': test[1], 'patient_name': test[2]})

        response = {'success': True, 'errorMessage': '',
                    'pending_tests': pendingTests}
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def updateTestResult(data):
    connection = connect()
    cursor = connection.cursor()
    print(data)
    try:
        query = '''
        UPDATE TEST_RESULTS SET SAMPLE_NO = :sample_no, TEST_DATE = TO_DATE(:test_date,'DD-MM-YYYY'), RESULT = :result, COMPLETED = 'T', STATUS = :status
        WHERE TEST_RESULT_ID = :test_result_id
        '''

        cursor.execute(query, [data['sample_no'], data['date'],
                               data['test_result'],  data['status'], data['test_result_id']])
        connection.commit()

        response = {'success': True, 'errorMessage': ''}
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def getPendingSurgeries(data):
    connection = connect()
    cursor = connection.cursor()

    try:
        if data['all_surgery']:
            query = '''
            SELECT SURGERY_RESULT_ID, SURGERY_DESC, COMPLETED,TO_CHAR(SURGERY_DATE), STATUS, RESULT
            FROM TABLE(RETURN_SURGERY_RESULT_TABLE((SELECT ID FROM PERSON WHERE USER_ID = :docID)))
            WHERE COMPLETED = 'A' OR COMPLETED = 'T'
            '''
            cursor.execute(query, [data['doc_id']])
            result = cursor.fetchall()

        elif data['surgery_id'] != None:
            query = '''
            SELECT SURGERY_RESULT_ID, SURGERY_DESC, COMPLETED,TO_CHAR(SURGERY_DATE), STATUS,RESULT
            FROM TABLE(RETURN_SURGERY_RESULT_TABLE((SELECT ID FROM PERSON WHERE USER_ID = :docID)))
            WHERE SURGERY_RESULT_ID = :surgery_id AND COMPLETED = 'A'
            '''
            cursor.execute(query, [data['doc_id'], data['surgery_id']])
            result = cursor.fetchall()
        else:
            query = '''
            SELECT SURGERY_RESULT_ID, SURGERY_DESC, COMPLETED,TO_CHAR(SURGERY_DATE), STATUS,RESULT
            FROM TABLE(RETURN_SURGERY_RESULT_TABLE((SELECT ID FROM PERSON WHERE USER_ID = :docID)))
            WHERE COMPLETED = 'A'
            '''
            cursor.execute(query, [data['doc_id']])
            result = cursor.fetchall()

        surgeries = []
        for surg in result:
            if surg[5] == None:
                comment = 'N/A'
            else:
                comment = surg[5]
            if surg[3] == None:
                surg_date = 'N/A'
            else:
                surg_date = surg[3]
            surgeries.append({'surgery_result_id': surg[0], 'surgery_desc': surg[1], 'completed': surg[2],
                              'surgery_date': surg_date, 'status': surg[4], 'result': comment})

        response = {}
        response['success'] = True
        response['errorMessage'] = ''
        response['surgeries'] = surgeries

        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def updateSurgeryResult(data):
    connection = connect()
    cursor = connection.cursor()

    try:
        query = '''
        UPDATE SURGERY_RESULTS SET RESULT = :result, COMPLETED = 'T', STATUS = :status, SURGERY_DATE = TO_DATE(:surgery_date,'DD-MM-YYYY')
        WHERE SURGERY_RESULT_ID = :surgery_result_id
        '''

        cursor.execute(query, [data['comment'], data['status'],
                               data['date'], data['surgery_result_id']])
        connection.commit()

        response = {'success': True, 'errorMessage': ''}

        return response
    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def getDiagnosisHistory(data):
    connection = connect()
    cursor = connection.cursor()

    response = {}

    if data['full_history']:
        try:
            query = '''
            SELECT T.TEST_RESULT_ID, S.SERVICE_NAME, TO_CHAR(T.TEST_DATE), T.RESULT,T.COMPLETED
            FROM TEST_RESULTS T JOIN SERVICE S ON(T.SERVICE_ID = S.SERVICE_ID)
            WHERE T.PATIENT_ID = (SELECT PATIENT_ID FROM APPOINTMENT WHERE APP_SL_NO = :app_sl_no)
            ORDER BY T.TEST_RESULT_ID DESC
            '''

            cursor.execute(query, [data['app_sl_no']])
            result = cursor.fetchall()

            tests = []

            for test in result:
                if test[2] == None:
                    test_date = 'N/A'
                else:
                    test_date = test[2]
                if test[3] == None:
                    res = 'N/A'
                else:
                    res = test[3]
                tests.append({'test_result_id': test[0], 'test_name': test[1],
                              'test_complete_date': test_date, 'test_result': res, 'completed': test[4]})

            response['tests'] = tests

            query = '''
            SELECT APP_SL_NO, SURGERY_RESULT_ID, TO_CHAR(SURGERY_DATE), SURGERY_DESC, COMPLETED, STATUS, RESULT
            FROM TABLE(RETURN_SURGERY_RESULT_PATIENT((SELECT P.USER_ID FROM PERSON P JOIN APPOINTMENT A ON(P.ID = A.PATIENT_ID)
                                                    WHERE A.APP_SL_NO = :app_sl_no)))
            ORDER BY SURGERY_RESULT_ID DESC
            '''

            cursor.execute(query, [data['app_sl_no']])
            result = cursor.fetchall()

            surgeries = []
            for surgery in result:
                if surgery[2] == None:
                    surg_date = 'N/A'
                else:
                    surg_date = surgery[2]
                if surgery[5] == None:
                    surg_status = 'N/A'
                else:
                    surg_status = surgery[5]
                if surgery[6] == None:
                    surg_res = 'N/A'
                else:
                    surg_res = surgery[6]
                surgeries.append({'app_sl_no': surgery[0], 'surgery_result_id': surgery[1], 'surgery_date': surg_date,
                                  'surgery_desc': surgery[3], 'completed': surgery[4], 'status': surg_status, 'result': surg_res})

            response['surgeries'] = surgeries

            response['success'] = True
            response['errorMessage'] = ''
            return response

        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response

    else:
        try:
            query = '''
            SELECT APP_SL_NO, TEST_RESULT_ID, SERVICE_NAME, TO_CHAR(TEST_COMPLETE_DATE) AS "DATE", TEST_RESULT, COMPLETED 
            FROM TABLE(RETURN_TEST_RESULT_TABLE((SELECT P.USER_ID FROM PERSON P JOIN APPOINTMENT A ON(P.ID = A.PATIENT_ID)
                                                    WHERE A.APP_SL_NO = :app_sl_no)))
            WHERE APP_SL_NO = :app_sl_no
            ORDER BY TEST_RESULT_ID DESC
            '''

            cursor.execute(query, [data['app_sl_no'], data['app_sl_no']])
            result = cursor.fetchall()

            tests = []
            for test in result:
                if test[3] == None:
                    test_date = 'N/A'
                else:
                    test_date = test[3]
                if test[4] == None:
                    res = 'N/A'
                else:
                    res = test[4]
                tests.append({'app_sl_no': test[0], 'test_result_id': test[1], 'test_name': test[2], 'test_complete_date': test_date,
                              'test_result': res, 'completed': test[5]})

            response['tests'] = tests

            query = '''
            SELECT APP_SL_NO, SURGERY_RESULT_ID, TO_CHAR(SURGERY_DATE) AS "DATE", SURGERY_DESC, COMPLETED,STATUS,RESULT
            FROM TABLE(RETURN_SURGERY_RESULT_PATIENT((SELECT P.USER_ID
                                                    FROM PERSON P JOIN APPOINTMENT A ON(P.ID = A.PATIENT_ID)
                                                    WHERE A.APP_SL_NO = :app_sl_no)))
            WHERE APP_SL_NO = :app_sl_no
            ORDER BY SURGERY_RESULT_ID DESC
            '''

            cursor.execute(query, [data['app_sl_no'], data['app_sl_no']])
            result = cursor.fetchall()

            surgeries = []
            for surgery in result:
                if surgery[2] == None:
                    surg_date = 'N/A'
                else:
                    surg_date = surgery[2]
                if surgery[5] == None:
                    surg_status = 'N/A'
                else:
                    surg_status = surgery[5]
                if surgery[6] == None:
                    surg_res = 'N/A'
                else:
                    surg_res = surgery[6]
                surgeries.append({'app_sl_no': surgery[0], 'surgery_result_id': surgery[1], 'surgery_date': surg_date,
                                  'surgery_desc': surgery[3], 'completed': surgery[4], 'status': surg_status, 'result': surg_res})

            response['surgeries'] = surgeries

            response['success'] = True
            response['errorMessage'] = ''

            return response
        except cx_Oracle.Error as error:
            errorObj, = error.args
            response = {'success': False, 'errorMessage': errorObj.message}
            print(response)
            return response


def getAllTestsUnderDoc(docID):
    connection = connect()
    cursor = connection.cursor()

    response = {}

    query = '''SELECT * FROM TABLE(RETURN_DOC_ALL_TEST_TABLE((:docID)))'''

    try:
        cursor.execute(query, [docID])
        resultTemp = cursor.fetchall()
        cursor.close()

        headers = [["Test Result ID", "Patient Name", "Appointment Serial No", "Service Name", 
                    "Test Completed On", "Test Result", "Completion Status"]]
        result = []
        for R in resultTemp:
            result_row = []
            for elements in R:
                result_row.append(elements)
            result.append(result_row)
        
        response['tableData'] = result
        response['tableHeader'] = headers
        response['success'] = True
        return response
    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'alertMessage': errorObj.message}
        return response



def getPatienttestResults(data):
    connection = connect()
    cursor = connection.cursor()

    response = {}
    try:
        result = []
        if data['allTests']:
            query = '''
            SELECT T.APP_SL_NO, T.TEST_RESULT_ID, T.SERVICE_NAME,TO_CHAR(T.TEST_COMPLETE_DATE), T.TEST_RESULT, T.COMPLETED,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTORS NAME"
            FROM TABLE(RETURN_TEST_RESULT_TABLE(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.COMPLETED = 'T' OR T.COMPLETED = 'A'
            ORDER BY T.TEST_RESULT_ID DESC
            '''

            cursor.execute(query, [data['userID']])
            result = cursor.fetchall()

        elif data['pendingTests']:
            query = '''
            SELECT T.APP_SL_NO, T.TEST_RESULT_ID, T.SERVICE_NAME,TO_CHAR(T.TEST_COMPLETE_DATE), T.TEST_RESULT, T.COMPLETED,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTORS NAME"
            FROM TABLE(RETURN_TEST_RESULT_TABLE(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.COMPLETED = 'A'
            ORDER BY T.TEST_RESULT_ID DESC
            '''
            cursor.execute(query, [data['userID']])
            result = cursor.fetchall()
        elif data['completedTests']:
            query = '''
            SELECT T.APP_SL_NO, T.TEST_RESULT_ID, T.SERVICE_NAME,TO_CHAR(T.TEST_COMPLETE_DATE), T.TEST_RESULT, T.COMPLETED,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTORS NAME"
            FROM TABLE(RETURN_TEST_RESULT_TABLE(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE COMPLETED = 'T'
            ORDER BY T.TEST_COMPLETE_DATE DESC
            '''
            cursor.execute(query, [data['userID']])
            result = cursor.fetchall()
        elif data['app_sl_no'] != None:
            query = '''
            SELECT T.APP_SL_NO, T.TEST_RESULT_ID, T.SERVICE_NAME,TO_CHAR(T.TEST_COMPLETE_DATE), T.TEST_RESULT, T.COMPLETED,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTORS NAME"
            FROM TABLE(RETURN_TEST_RESULT_TABLE(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.APP_SL_NO = :app_sl_no AND (T.COMPLETED = 'T' OR T.COMPLETED = 'A')
            ORDER BY T.TEST_RESULT_ID DESC
            '''
            cursor.execute(query, [data['userID'], data['app_sl_no']])
            result = cursor.fetchall()

        test_results = []
        if len(result) != 0:
            for test in result:
                test_results.append({'app_sl_no': test[0], 'test_result_id': test[1], 'service_name': test[2],
                                     'test_complete_date': test[3], 'test_Rresult': test[4], 'completed': test[5], 'doctor_name': test[6]})

        response['test_results'] = test_results
        response['success'] = True
        response['errorMessage'] = ''
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def getMedicineData(med_id, med_name):
    connection = connect()
    cursor = connection.cursor()

    response = {}
    query = '''SELECT * FROM MEDICINE WHERE MED_ID = (:med_id)'''
    try:
        cursor.execute(query, [med_id])
        resultTemp = cursor.fetchall()
        cursor.close()
        result = {
            'med_id': resultTemp[0][0],
            'med_name': resultTemp[0][1],
            'genre': resultTemp[0][2],
            'stock': resultTemp[0][3],
            'price_per_piece': resultTemp[0][4]
        }
        response['med_data'] = result
        response['success'] = True
        return response 
    except cx_Oracle.Error as error:
        response = {'success': False, 'alertMessage': 'Data Base Failure'}
        return response


def sellMedicine(patientID, quantity, medID):
    connection = connect()
    cursor = connection.cursor()
    quantity = int(quantity)
    response = {}
    query = '''INSERT INTO DISPENSARY(MED_ID, ASSIGNED_TO, QUANTITY_PCS) 
                VALUES(:medID, (SELECT ID FROM PERSON WHERE USER_ID = (:patientID)), :quantity)'''
    try:
        cursor.execute(query, [medID, patientID, quantity])
        connection.commit()
        response['success'] = True
        response['Message'] = "Successfully Saved"
        return response
    except cx_Oracle.Error:
        response = {'success': False, 'alertMessage': 'DataBase Failure'}
        return response


def addStock(new_price, amount, medID):
    connection = connect()
    cursor = connection.cursor()
    if float(new_price) == 0.0:
        update_price = False
    else:
        update_price = True
    response = {}
    query1 = '''UPDATE MEDICINE SET STOCK = (SELECT STOCK FROM MEDICINE WHERE MED_ID = (:medID)) + (:amount)
             WHERE MED_ID = (:medID)'''
    
    query2 = '''UPDATE MEDICINE SET PRICE_PIECE = (:new_price)
             WHERE MED_ID = (:medID)'''
    try:
        cursor.execute(query1, [medID, amount, medID])
        if update_price:
            cursor.execute(query2, [float(new_price), medID])
        connection.commit()
        response['success'] = True
        response['Message'] = "Successfully Saved"
        return response
    except cx_Oracle.Error:
        response = {'success': False, 'alertMessage': 'DataBase Failure'}
        return response
                         
def getPatientSurgeryResult(data):
    connection = connect()
    cursor = connection.cursor()

    response = {}
    try:
        result = []
        if data['allSurgery']:
            query = '''
            SELECT T.APP_SL_NO, T.SURGERY_RESULT_ID, TO_CHAR(T.SURGERY_DATE), T.SURGERY_DESC, T.COMPLETED, T.STATUS, T.RESULT,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTOR NAME"
            FROM TABLE(RETURN_SURGERY_RESULT_PATIENT(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.COMPLETED = 'T' OR T.COMPLETED = 'A'
            ORDER BY T.SURGERY_RESULT_ID DESC
            '''
            cursor.execute(query, [data['userID']])
            result = cursor.fetchall()

        elif data['pendingSurgery']:
            query = '''
            SELECT T.APP_SL_NO, T.SURGERY_RESULT_ID, TO_CHAR(T.SURGERY_DATE), T.SURGERY_DESC, T.COMPLETED, T.STATUS, T.RESULT,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTOR NAME"
            FROM TABLE(RETURN_SURGERY_RESULT_PATIENT(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.COMPLETED = 'A'
            ORDER BY T.SURGERY_RESULT_ID DESC
            '''
            cursor.execute(query, [data['userID']])
            result = cursor.fetchall()

        elif data['completedSurgery']:
            query = '''
            SELECT T.APP_SL_NO, T.SURGERY_RESULT_ID, TO_CHAR(T.SURGERY_DATE), T.SURGERY_DESC, T.COMPLETED, T.STATUS, T.RESULT,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTOR NAME"
            FROM TABLE(RETURN_SURGERY_RESULT_PATIENT(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.COMPLETED = 'T'
            ORDER BY T.SURGERY_DATE DESC, T.SURGERY_RESULT_ID DESC
            '''
            cursor.execute(query, [data['userID']])
            result = cursor.fetchall()

        elif data['app_sl_no'] != None:
            query = '''
            SELECT T.APP_SL_NO, T.SURGERY_RESULT_ID, TO_CHAR(T.SURGERY_DATE), T.SURGERY_DESC, T.COMPLETED, T.STATUS, T.RESULT,
            (P.FIRST_NAME || ' ' || P.LAST_NAME) AS "DOCTOR NAME"
            FROM TABLE(RETURN_SURGERY_RESULT_PATIENT(:pat_id)) T JOIN APPOINTMENT A ON(T.APP_SL_NO = A.APP_SL_NO)
            JOIN PERSON P ON(A.DOCTOR_ID = P.ID)
            WHERE T.APP_SL_NO = :app_sl_no AND  (T.COMPLETED = 'T' OR T.COMPLETED = 'A')
            ORDER BY  T.SURGERY_RESULT_ID DESC
            '''
            cursor.execute(query, [data['userID'],  data['app_sl_no']])
            result = cursor.fetchall()

        surgery_result = []
        if len(result) != 0:
            for surg in result:
                surgery_result.append({'app_sl_no': surg[0], 'surgery_result_id': surg[1], 'surgery_date': surg[2],
                                       'surgery_desc': surg[3], 'completed': surg[4], 'status': surg[5], 'result': surg[6],
                                       'doctor_name': surg[7]})
        response['surgery_result'] = surgery_result
        response['success'] = True
        response['errorMessage'] = ''
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def getAdmittedPatient(data):
    connection = connect()
    cursor = connection.cursor()

    response = {}
    try:
        query = '''
        SELECT R.ROOM_NO, R.BLOCK_ID,B.CATEGORY
        FROM ROOM R JOIN BLOCK B ON(R.BLOCK_ID = B.BLOCK_ID)
        WHERE B.INCHARGE_ID = (SELECT ID FROM PERSON WHERE USER_ID = :doc_id)
        ORDER BY R.ROOM_NO
        '''

        cursor.execute(query, [data['userID']])
        result = cursor.fetchall()

        rooms = []

        for room in result:
            query = '''
            SELECT (SELECT USER_ID FROM PERSON WHERE ID = RA.PATIENT_ID),
            (SELECT (FIRST_NAME|| ' ' || LAST_NAME) AS NAME FROM PERSON WHERE ID = RA.PATIENT_ID) AS "NAME",
            RA.ADMISSION_DATE, RA.ADMISSION_SL
            FROM ROOM_ADMISSION RA
            WHERE RA.ROOM_NO = :room_no AND RA.RELEASE_DATE IS NULL
            '''

            cursor.execute(query, [room[0]])
            pat_result = cursor.fetchall()
            patients = []
            for pat in pat_result:
                patients.append(
                    {'patient_id': pat[0], 'patient_name': pat[1], 'admission_date': pat[2], 'admission_sl': pat[3]})

            rooms.append({'room_no': room[0], 'block_id': room[1],
                          'block_category': room[2], 'patients': patients})

        response['rooms'] = rooms
        response['success'] = True
        response['errorMessage'] = ''
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response


def getPatientMonitorData(data):
    connection = connect()
    cursor = connection.cursor()

    response = {}
    try:
        query = '''
        SELECT HEARTBEAT, SYS_BP,DIAS_BP,TEMPERATURE, OXY_LEVEL,BREATHING_RATE,  FLOOR((SYSDATE - CAST(TIME AS DATE))*24) AS "HOUR",
        (ROUND((SYSDATE - CAST(TIME AS DATE))*24,2)-FLOOR((SYSDATE - CAST(TIME AS DATE))*24))*60 AS "MINUTE", TO_CHAR(CAST(TIME AS DATE),'MM/DD/YYYY HH:MI:SS') AS "TIME"
        FROM MONITORING_DATA
        WHERE PATIENT_ID = (SELECT ID FROM PERSON WHERE USER_ID = :pat_id)
        ORDER BY HOUR, MINUTE
        '''

        cursor.execute(query, [data['patient_id']])
        result = cursor.fetchall()

        monitroData = []
        for dat in result:
            monitroData.append({'heart_beat': dat[0], 'sys_bp': dat[1], 'dias_bp': dat[2],
                                'temperature': dat[3], 'oxygen_level': dat[4], 'breathing_rate': dat[5], 'hours_past': dat[6],
                                'minutes_past': dat[7], 'time_of_data': dat[8]})

        query = '''
        SELECT (SELECT USER_ID FROM PERSON WHERE ID = RA.PATIENT_ID),
        (SELECT (FIRST_NAME|| ' ' || LAST_NAME) AS NAME FROM PERSON WHERE ID = RA.PATIENT_ID) AS "NAME",
        TO_CHAR(RA.ADMISSION_DATE) AS "ADMISSION_DATE", RA.ADMISSION_SL
        FROM ROOM_ADMISSION RA
        WHERE RA.PATIENT_ID = (SELECT ID FROM PERSON WHERE USER_ID = :pat_id)
        '''

        cursor.execute(query, [data['patient_id']])
        pat_result = cursor.fetchone()

        response['monitor_data'] = monitroData
        response['patient_info'] = {'patient_id': pat_result[0], 'patient_name': pat_result[1], 'admission_date': pat_result[2],
                                    'admission_sl': pat_result[3]}

        response['success'] = True
        response['errorMessage'] = ''
        return response

    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'errorMessage': errorObj.message}
        print(response)
        return response
