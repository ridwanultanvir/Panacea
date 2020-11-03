from django.http import response
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import execution

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
