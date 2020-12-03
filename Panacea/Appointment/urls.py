from django.urls import path, include
from . import views

urlpatterns = [
     path('get-departments/', views.getAllDepartments, name='getAllDepartments'),
     path('get-all-doctors/', views.getAllDoctorsInADeptartment, name="getAllDoctors"),
     path('get-schedule/', views.getScheduleOfDoctor, name="getSchedule"),
     path('check-if-schedule-avalable/', views.checkScheduleForPatient,
          name='checkScheduleForPatient'),
     path('save-appointment/', views.saveAppointment, name='saveAppointment'),
     path('get-receptionist-appointments/',
          views.getReceptionistAppointments, name='getReceptionistAppointments'),
     path('accept-receptionist-appointment/', views.acceptAppointment,
          name='accept-receptionist-appointment'),

     path('get-all-doc-appointment/', views.getAllDocAppointments,
          name='getAllDocAppointments'),
     path('get-patient-all-appnt/', views.getAllPatientAppointment, name='getAllPatientAppointment'),
     path('get-next-patient-appnt/', views.getNextAppnt, name='getNextAppnt'),
]
