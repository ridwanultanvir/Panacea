from json import decoder
import cx_Oracle
import hashlib

from django.http import response
from UserHandler.execution import connect



def returnPaymentData(patientID):
    connection = connect()
    cursor = connection.cursor()
    response = {}
    query_checkup_bill = '''SELECT D.NAME, D.DEPARTMENT, D.VISITING_FEE, 
                            TO_CHAR(CH.CHECKUP_DATE, 'DD/MM/YYYY') AS VISITING_DATE, A.PROB_DESC
                            FROM CHECKUP CH JOIN APPOINTMENT A
                            ON (CH.APP_SL_NO = A.APP_SL_NO AND A.PATIENT_ID = (SELECT ID FROM PERSON WHERE USER_ID = (:patientID))
                            AND A.STATUS='accepted' AND CH.PAYMENT_STATUS = 'DUE' ) JOIN 
                            (SELECT P.ID AS ID,(P.FIRST_NAME||' '||P.LAST_NAME) AS NAME, DOC.DEPARTMENT, DOC.VISITING_FEE
                            FROM PERSON P JOIN DOCTOR DOC ON P.ID = DOC.ID ) 
                            D ON (D.ID = A.DOCTOR_ID) ORDER BY VISITING_DATE DESC'''

    query_surg_bill = '''SELECT R.ROOM_NO, TO_CHAR(RA.ADMISSION_DATE, 'DD/MM/YYYY'), R.CHARGE FROM ROOM_ADMISSION RA 
                        JOIN ROOM R
                        ON (RA.ROOM_NO = R.ROOM_NO AND RA.PATIENT_ID = (SELECT ID FROM PERSON WHERE USER_ID = (:patientID))
                        AND RA.ROOM_NO IN 
                        (SELECT R.ROOM_NO FROM ROOM R JOIN BLOCK B
                        ON R.BLOCK_ID = B.BLOCK_ID AND B.CATEGORY = 'SURGERY' AND R.STATUS='active')
                        AND RA.RELEASE_DATE IS NOT NULL AND RA.ADMISSION_DATE <= SYSDATE AND RA.PAID = 'F')'''

    query_room_bill = '''SELECT R.ROOM_NO, TO_CHAR(RA.ADMISSION_DATE, 'DD/MM/YYYY') AS ADMISSION_DATE, 
                        (TRUNC(SYSDATE-RA.ADMISSION_DATE)+1) AS DAYS_BETWEEN, R.CHARGE
                        FROM ROOM_ADMISSION RA JOIN ROOM R
                        ON (RA.ROOM_NO = R.ROOM_NO AND RA.PATIENT_ID = (SELECT ID FROM PERSON WHERE USER_ID = (:patientID))
                        AND RA.ROOM_NO NOT IN 
                        (SELECT R.ROOM_NO FROM ROOM R JOIN BLOCK B
                        ON R.BLOCK_ID = B.BLOCK_ID AND B.CATEGORY = 'SURGERY' AND R.STATUS='active')
                        AND RA.RELEASE_DATE IS NULL AND RA.ADMISSION_DATE <= SYSDATE)'''

    query_med_bil = '''SELECT MN.MED_NAME, D.QUANTITY_PCS, MN.PRICE_PIECE FROM DISPENSARY D
                        JOIN MEDICINE MN ON D.MED_ID = MN.MED_ID 
                        AND D.ASSIGNED_TO = (SELECT ID FROM PERSON WHERE USER_ID = (:patientID)) AND D.PAID = 'F' '''

    try:
        response = {}
        #  checkup bill
        cursor.execute(query_checkup_bill, [patientID])
        resultCheckUpBillTemp = cursor.fetchall()

        checkUpTableHeaders = [["Doctor Name", "Department", "Visiting Fee", "Visiting Date", "Description"]]
        resultCheckUpBill = []
        total_checkup_bill = 0
        for R in resultCheckUpBillTemp:
            result_row = []
            for elements in R:
                result_row.append(elements)
            resultCheckUpBill.append(result_row)

        for R in resultCheckUpBillTemp:
            total_checkup_bill = total_checkup_bill + R[2]

        # surgery bill
        cursor.execute(query_surg_bill, [patientID])
        resultSurgBillTemp = cursor.fetchall()

        surgTableHeaders = [["Room No", "Operation Date", "Charge"]]
        resultSurgBill = []
        total_surg_bill = 0
        for R in resultSurgBillTemp:
            result_row = []
            for elements in R:
                result_row.append(elements)
            resultSurgBill.append(result_row)
        for R in resultSurgBillTemp:
            total_surg_bill = total_surg_bill + R[2]

        # room bill
        cursor.execute(query_room_bill, [patientID])
        resultRoomBillTemp = cursor.fetchall()

        roomTableHeaders = [["Room No", "Admission Date", "Admission Duration", "Charge Per Day"]]
        resultRoomBill = []
        total_room_bill = 0
        for R in resultRoomBillTemp:
            result_row = []
            for elements in R:
                result_row.append(elements)
            resultRoomBill.append(result_row)
        for R in resultRoomBillTemp:
            total_room_bill = total_room_bill + R[3]*R[2]

        # medicine bill
        cursor.execute(query_med_bil, [patientID])
        resultMedBillTemp = cursor.fetchall()

        medTableHeaders = [["Medicine Name", "Quantity(pcs)", "Price per piece"]]
        resultMedBill = []
        total_med_bill = 0
        for R in resultMedBillTemp:
            result_row = []
            for elements in R:
                result_row.append(elements)
            resultMedBill.append(result_row)
        for R in resultMedBillTemp:
            total_med_bill = total_med_bill + round(R[2]*R[1], 2)

        cursor.close()
        response['checkUpTableHeaders'] = checkUpTableHeaders
        response['surgTableHeaders'] = surgTableHeaders
        response['roomTableHeaders'] = roomTableHeaders
        response['medTableHeaders'] = medTableHeaders
        response['resultCheckUpBill'] = resultCheckUpBill
        response['resultSurgBill'] = resultSurgBill
        response['resultRoomBill'] = resultRoomBill
        response['resultMedBill'] = resultMedBill

        response['total_checkup_bill'] = total_checkup_bill
        response['total_surg_bill'] = total_surg_bill
        response['total_room_bill'] = total_room_bill
        response['total_med_bill'] = total_med_bill
        response['total_bill'] = total_checkup_bill + total_surg_bill + total_room_bill + total_med_bill

        response['success'] = True
        return response
    except cx_Oracle.Error as error:
        errorObj, = error.args
        response = {'success': False, 'alertMessage': 'Failure'}
        return response



def confirmPayment(patientID, total_amount):
    connection = connect()
    cursor = connection.cursor()
    response = {}

    query = '''INSERT INTO BILL(TOTAL_AMOUNT, PATIENT_ID, PAYMENT_CATEGORY) VALUES
                (:total_amount, (SELECT ID FROM PERSON WHERE USER_ID = (:patientID)), 'hosp_services') '''

    try:
        cursor.execute(query, [total_amount, patientID])
        connection.commit()
        cursor.close()
        return {'success': True, 'message': 'Bill Payment Successfully saved'}
    except cx_Oracle.Error as error:
        errorObj, = error.args
        print(errorObj)
        response = {'success': False, 'alertMessage': 'Failed'}
        return response