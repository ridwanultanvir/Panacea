from . import execution
from django.http import response
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from UserHandler.execution import verifyToken


# Create your views here.


@api_view(['POST'])
def getScheduleTable(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'userCategory' in data:
        if data['userCategory'] == "employee":
            searchID = data['empUserID']
        elif data['userCategory'] == "doctor":
            searchID = data['docUserID']
    if(verifyToken(userID, token)):
        response = execution.getScheduleTable(data['userCategory'], searchID)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None, 'empData': None}

    return Response(response)


@api_view(['POST'])
def deleteSchedule(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'userCategory' in data:
        if data['userCategory'] == "employee":
            searchID = data['empUserID']
        elif data['userCategory'] == "doctor":
            searchID = data['docUserID']

    if(verifyToken(userID, token)):
        response = execution.deleteSchedule(
            data['selectedSchedules'], data['userCategory'], searchID)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None, 'empData': None}

    return Response(response)


@api_view(['POST'])
def getTimeTable(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.getTimeTable()
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def getWardTable(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None
    category = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'category' in data:
        category = data['category']
    if(verifyToken(userID, token)):
        response = execution.getWardTable(category)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def getWardCategory(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.getWardCategory()
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def addSchedule(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'userCategory' in data:
        if data['userCategory'] == "employee":
            searchID = data['empUserID']
        elif data['userCategory'] == "doctor":
            searchID = data['docUserID']

    if(verifyToken(userID, token)):
        response = execution.addSchedule(
            searchID, data['userCategory'], data['timeID'], data['date'], data['block'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None, 'empData': None}
    return Response(response)


@api_view(['POST'])
def addScheduleRange(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'userCategory' in data:
        if data['userCategory'] == "employee":
            targetID = data['empUserID']
        elif data['userCategory'] == "doctor":
            targetID = data['docUserID']

    if(verifyToken(userID, token)):
        response = execution.addScheduleRange(
            targetID, data['userCategory'], data['timeID'], data['days'], data['blockID'], data['scheduleLength'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None, 'empData': None}
    return Response(response)


@api_view(['POST'])
def getAppointmentData(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    diagnosisID = None
    if 'diagnosis-id' in data:
        diagnosisID = data['diagnosis-id']

    print(diagnosisID)
    if diagnosisID == None:
        response = {'success': False, 'errorMessage': 'Invalid request'}
    else:
        response = execution.getAppntWithSl(diagnosisID)
    if response == None:
        response = {'success': False, 'errorMessage': 'Invalid request'}
    return Response(response)


@api_view(['POST'])
def getDocListDept(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    if 'docID' in data:
        docID = data['docID']
    if 'date' in data:
        searchDate = data['date']
    response = execution.getFreeDocOnDate(docID, searchDate)
    if response['docData'] == []:
        response = {'success': False, 'alertMessage': "Not Okay"}
    return Response(response)


@api_view(['POST'])
def getRoomList(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    if 'date' in data:
        searchDate = data['date']
    if 'type' in data:
        roomType = data['type']
    if 'time' in data:
        timeID = data['time']
    response = execution.getRoomList(searchDate, roomType, timeID)
    if response['roomData'] == []:
        response = {'success': False,
                    'alertMessage': "No Room Available For This Date On That Time"}
    return Response(response)


@api_view(['POST'])
def addSurSchedule(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    if 'inchargeDocID' in data:
        inchargeDocID = data['inchargeDocID']
    if 'room_no' in data:
        room_no = data['room_no']
    if 'appnt_serial_no' in data:
        appnt_serial_no = data['appnt_serial_no']
    if 'timeID' in data:
        timeID = data['timeID']
    if 'selectedDate' in data:
        selectedDate = data['selectedDate']
    if 'duration' in data:
        duration = data['duration']
    if 'patient_id' in data:
        patient_id = data['patient_id']
    if 'surgery_result_id' in data:
        surgery_result_id = data['surgery_result_id']
    print(inchargeDocID, room_no, appnt_serial_no, timeID,
          selectedDate, duration, patient_id, surgery_result_id)

    response = execution.addSurSchedule(appnt_serial_no, inchargeDocID, patient_id,
                                        room_no, timeID, duration, selectedDate, surgery_result_id)
    # response = {'success':False}
    return Response(response)


@api_view(['POST'])
def getPatientDetails(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    patientID = data['patientID']
    return Response(execution.getPatientDetails(patientID))


@api_view(['POST'])
def getAdmitRoomList(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    ward = data['category']
    roomType = data['type']
    return Response(execution.getAdmitRoomList(ward, roomType))


@api_view(['POST'])
def roomTypesforCats(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    ward = data['category']
    return Response(execution.getRoomTypesForWard(ward))


@api_view(['POST'])
def admitPatientReq(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    return Response(execution.admitPatient(data['patientID'], data['room_no'], data['date']))


@api_view(['POST'])
def getUserdetails(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = data['userID']
    return Response(execution.getUserDetails(userID))


@api_view(['POST'])
def getBlockForCats(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    block_category = data['block-category']
    return Response(execution.getBlocksPerCategory(block_category))


@api_view(['POST'])
def addIncharge(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    block_id = data['block_id']
    inChargeUserID = data['inChargeID']
    return Response(execution.addIncharge(block_id, inChargeUserID))


@api_view(['POST'])
def scheduleHistory(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = data['userID']
    token = data['token']
    employeeID = data['employeeID']
    if verifyToken(userID, token):
        return Response(execution.scheduleHisEmp(employeeID))
    else:
        return Response({'success': False, 'alertMessage': "Verification Failed"})
    

@api_view(['POST'])
def scheduleOnDate(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = data['userID']
    token = data['token']
    wardCategory = data['wardCategory']
    sch_on_date = data['sch_on_date']
    if verifyToken(userID, token):
        return Response(execution.scheduleOnWardDate(wardCategory, sch_on_date))
    else:
        return Response({'success': False, 'alertMessage': "Verification Failed"})
   
@api_view(['POST'])
def getUserSchedule(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getUserSchedule(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)



@api_view(['POST'])
def getWardDetailsDisp(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if 'blockID' in data:
        blockID = data['blockID']
    if(verifyToken(userID, token)):
        response = execution.getWardDetailsDisp(blockID)
    else:
        response = {'success': False, 'errorMessage': 'Verification Failed'}

    return Response(response)