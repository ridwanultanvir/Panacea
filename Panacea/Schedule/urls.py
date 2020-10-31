from django.urls import path
from . import views

urlpatterns = [
    path('schedule-table/', views.getScheduleTable, name='getScheduleTable'),
    path('delete-schedule/', views.deleteSchedule, name='deleteSchedule'),
    path('add-schedule/', views.addSchedule, name='addSchedule'),
    path('time-table/', views.getTimeTable, name='getTimeTable')
]
