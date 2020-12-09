from django.urls import path
from . import views

urlpatterns = [
    path('schedule-table/', views.getScheduleTable, name='getScheduleTable'),
    path('delete-schedule/', views.deleteSchedule, name='deleteSchedule'),
    path('add-schedule/', views.addSchedule, name='addSchedule'),
    path('add-schedule-range/', views.addScheduleRange, name='addScheduleRange'),
    path('time-table/', views.getTimeTable, name='getTimeTable'),
    path('ward-table/', views.getWardTable, name='getWardTable'),
    path('ward-category/', views.getWardCategory, name='getWardCategory'),
    path('appointment-data/', views.getAppointmentData, name='getAppointmentData'),
    path('doc-dept-list/', views.getDocListDept, name='getDocListDept'),
    path('admit-room-list/', views.getAdmitRoomList, name='getAdmitRoomList'),
    path('surgery-room-list/', views.getRoomList, name='getSurRoomList'),
    path('add-sur-schedule/', views.addSurSchedule, name='addSurSchedule'),
    path('patient-details/', views.getPatientDetails, name='getPatientDetails'),
    path('room-types-for-categories/',
         views.roomTypesforCats, name='roomTypesforCats'),
    path('admit-patient/', views.admitPatientReq, name='admitPatientReq'),
    path('user-details/', views.getUserdetails, name='getUserdetails'),
    path('block-ids-per-category/', views.getBlockForCats, name='getBlockForCats'),
    path('add-incharge/', views.addIncharge, name='addIncharge'),
    path('get-schedule-for-employee/', views.scheduleHistory, name='scheduleHistory'),
    path('schedule-on-date/', views.scheduleOnDate, name='scheduleOnDate'),
    path('get-user-schedule/', views.getUserSchedule, name="getUserSchedule"),
]
