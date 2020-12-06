from django.urls import path
from . import views
urlpatterns = [
    path('get-diagnosis-list/', views.getDiagnosisList, name='getDiagnosisList'),
    path('diagnosis/', views.diagnosis, name='diagnosis'),
    path('receptionist/tests/', views.receptionistTests, name='receptionistTests'),
    path('receptionist/service-results-table/',
         views.serviceResultsTable, name='service-results-table'),
    path('receptionist/approve-test/', views.receptionistApproveTest,
         name="receptionistApproveTest"),
    path('receptionist/approve-surgery/', views.receptionistApproveSurgery,
         name="receptionistApproveSurgery"),
    path('technician/pending-tests/', views.technicianPendingTests,
         name='technicianPendingTests'),
    path('technician/update-test-result/',
         views.updateTestResult, name='updateTestResult'),
    path('doctor/get-pending-surgeries/',
         views.getPendingSurgeries, name="getPendingSurgeries"),
    path('doctor/update-surgery-result/',
         views.updateSurgeryResult, name='update-surgery-result'),
    path('doctor/get-diagnosis-history/',
         views.getDiagnosisHistory, name='getDIagnosisHistory'),
     path('get-tests-under-doc/', views.getTestUnderDoc, name='getTestUnderDoc'),
]
