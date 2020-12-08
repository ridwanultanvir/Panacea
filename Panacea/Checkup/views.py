from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import execution
from UserHandler.execution import verifyToken

# Create your views here.


@api_view(['POST'])
def getDiagnosisList(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getDiagnosisList(
            data['app_sl_no'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def diagnosis(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.diagnosis(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def receptionistTests(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.receptionistTests(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def serviceResultsTable(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.serviceResultsTable(data['diagnosisID'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def receptionistApproveTest(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.receptionistApproveTest(
            data['diagnosisID'], data['test_result_id'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def receptionistApproveSurgery(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.receptionistApproveSurgery(
            data['diagnosisID'], data['surgery_result_id'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def technicianPendingTests(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.technicianPendingTests(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def updateTestResult(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.updateTestResult(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getPendingSurgeries(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.getPendingSurgeries(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def updateSurgeryResult(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']
    if(verifyToken(userID, token)):
        response = execution.updateSurgeryResult(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getDiagnosisHistory(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getDiagnosisHistory(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

    return Response(response)


@api_view(['POST'])
def getPatienttestResults(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getPatienttestResults(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getPatientSurgeryResult(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getPatientSurgeryResult(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getAdmittedPatient(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getAdmittedPatient(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)


@api_view(['POST'])
def getPatientMonitorData(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)

    userID = None
    token = None

    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.getPatientMonitorData(data)
    else:
        response = {'success': False, 'errorMessage': 'Invalid request'}

    return Response(response)
