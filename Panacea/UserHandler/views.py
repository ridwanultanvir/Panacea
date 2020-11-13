from django.http import request
from django.http import response
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
import json
from . import execution

# Create your views here.


@api_view(['POST'])
def loginUser(request):
    body = request.body.decode('utf-8')
    credentials = json.loads(body)
    print(credentials)
    response = execution.login(credentials)
    print(response)
    return Response(response)


@api_view(['POST'])
def getPatientData(request):
    body = request.body.decode('utf-8')
    credentials = json.loads(body)
    print(credentials)

    response = execution.getPatientData(credentials)
    print(response)

    return Response(response)


@api_view(['POST'])
def registerPatient(request):
    body = request.body.decode('utf-8')
    data = json.loads(body)
    print(data)

    response = execution.registerPatient(data)

    return Response(response)
