from threading import Thread
from StreamApp.execution import consumerFunction
import time
from django.apps import AppConfig


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
