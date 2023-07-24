import threading
import time

def unending_process1():
    while True:
        print("Running unending process 1...")
        time.sleep(1)  # Sleep for 1 second

def unending_process2():
    while True:
        print("Running unending process 2...")
        time.sleep(5)  # Sleep for 5 seconds

# Create and start the first thread
thread1 = threading.Thread(target=unending_process1)
thread1.daemon = True  # Set the thread as a daemon to allow program termination
thread1.start()

# Create and start the second thread
thread2 = threading.Thread(target=unending_process2)
thread2.daemon = True  # Set the thread as a daemon to allow program termination
thread2.start()

# Use an Event to wait indefinitely in the main thread
exit_event = threading.Event()
exit_event.wait()