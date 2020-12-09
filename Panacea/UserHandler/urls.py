from os import name
from django.urls import path
from . import views

urlpatterns = [
    #path('register/patient/', views.patientRegister , name = "PatientRegister" ),
    path('login/', views.loginUser, name='userLogin'),
    path('get-patient-data/', views.getPatientData, name='getPatientData'),
    path('registration/', views.registerPatient, name='registerPatient'),
    path('admin/add-user/', views.adminAddUser, name='adminAddUser'),
    path('get-notifications/', views.getNotification, name='getNotification'),
    path('notifications/mark-as-read/',
         views.markNotificationAsRead, name='markNotificationRead'),
    path('update-user/', views.updateUser, name='updateUser'),
]
