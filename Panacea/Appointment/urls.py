from django.urls import path, include
from . import views

urlpatterns = [
    path('get-departments/', views.getAllDepartments, name='getAllDepartments'),
    path('get-all-doctors/', views.getAllDoctorsInADeptartment, name="getAllDoctors"),
    path('get-schedule/', views.getScheduleOfDoctor, name="getSchedule"),
    path('check-if-schedule-avalable/', views.checkScheduleForPatient,
         name='checkScheduleForPatient'),
    path('save-appointment/', views.saveAppointment, name='saveAppointment'),
]
