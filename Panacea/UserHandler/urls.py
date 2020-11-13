from os import name
from django.urls import path
from . import views

urlpatterns = [
    #path('register/patient/', views.patientRegister , name = "PatientRegister" ),
    path('login/', views.loginUser, name='userLogin'),
    path('get-patient-data/', views.getPatientData, name='getPatientData'),
    path('registration/', views.registerPatient, name='registerPatient')
]
