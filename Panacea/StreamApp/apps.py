from django.apps import AppConfig
from threading import Thread 
import time
from StreamApp.execution import consumerFunction


class TestThread(Thread):

    def run(self):
        consumerFunction()

class StreamappConfig(AppConfig):
    name = 'StreamApp'

    def ready(self):
        print("Ready Stream")
        x = TestThread()
        x.setDaemon(True)
        print("starting thread")
        x.start()