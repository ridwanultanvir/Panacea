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
]
