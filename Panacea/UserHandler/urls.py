from os import name
from django.urls import path
from . import views

urlpatterns = [
    #path('register/patient/', views.patientRegister , name = "PatientRegister" ),
    path('login/', views.loginUser, name='userLogin'),
]
