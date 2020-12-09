from django.urls import path
from . import views
urlpatterns = [
    path('get-patient-payment/', views.getPaymentData, name='getPaymentData'),
    path('save-payment/', views.savePayment, name='savePayment')
]