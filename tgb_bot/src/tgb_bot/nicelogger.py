from datetime import datetime


class NiceLogger:
    def log(self, message):
        datenow = datetime.today().strftime("%d-%m-%Y %H:%M:%S")
        print("{0} |  {1}".format(datenow, message))
