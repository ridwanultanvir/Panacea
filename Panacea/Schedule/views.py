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

    if(verifyToken(userID, token)):
        response = execution.getScheduleTable(data['docUserID'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

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

    if(verifyToken(userID, token)):
        response = execution.deleteSchedule(
            data['selectedSchedules'], data['docUserID'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}

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
def addSchedule(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    userID = None
    token = None
    if 'userID' in data:
        userID = data['userID']
    if 'token' in data:
        token = data['token']

    if(verifyToken(userID, token)):
        response = execution.addSchedule(
            data['docUserID'], data['timeID'], data['date'])
    else:
        response = {'success': False, 'errorMessage': 'Invalid request',
                    'scheduleData': None, 'docData': None}
    return Response(response)
