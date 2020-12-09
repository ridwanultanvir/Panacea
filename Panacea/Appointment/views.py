from django.http import response
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import execution
from UserHandler.execution import verifyToken

# Create your views here.


@api_view(['GET'])
def getAllDepartments(request):
    response = execution.getAllDepartments()
    return Response(response)


@api_view(['POST'])
def getAllDoctorsInADeptartment(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    response = execution.getAllDoctorsInADeptartment(data['dept_name'])

    return Response(response)


@api_view(['POST'])
def getScheduleOfDoctor(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    response = execution.getScheduleOfDoctor(data['docID'])

    return Response(response)


@api_view(['POST'])
def checkScheduleForPatient(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    patientID = None
    scheduleId = None
    newPatient = None

    if 'patient_id' in data:
        patientID = data['patient_id']
    if 'schedule_id' in data:
        scheduleId = data['schedule_id']
    if 'new_patient' in data:
        newPatient = data['new_patient']

    if patientID == None or scheduleId == None or newPatient == None:
        response = {'success': False, 'errorMessage': 'invalid request'}

    elif newPatient:
        response = {'success': True, 'errorMessage': ''}
    else:
        response = execution.checkScheduleForPatient(
            patientID, scheduleId)

    return Response(response)


@api_view(['POST'])
def saveAppointment(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    response = execution.saveAppointment(data)

    return Response(response)


@api_view(['POST'])
def getReceptionistAppointments(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getReceptionistAppointments()
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def acceptAppointment(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.acceptReceptionistAppointment(data['app_sl_no'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def getAllDocAppointments(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getAllDocAppointments(
            userID, data['todaysAppointment'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def getAllPatientAppointment(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = data['userID']
    return Response(execution.getPatientAppointments(userID))


@api_view(['POST'])
def getNextAppnt(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = data['userID'] 
    return Response(execution.getNextAppointments(userID))


@api_view(['POST'])
def getAppntPatient(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = data['userID']
    token = data['token']
    patientID = data['patientID']
    date_range = data['date_range']
    if verifyToken(userID, token):
        return Response(execution.getAppointmentsOfPatient(patientID, date_range))
    else:
        return Response({'success': False, 'alertMessage': "verification failed"})


@api_view(['POST'])
def getAppntUnderDoc(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = data['userID']
    token = data['token']
    docID = data['docID']
    if verifyToken(userID, token):
        return Response(execution.getAppointsUnderDoc(docID))
    else:
        return Response({'success': False, 'alertMessage': "verification failed"})
