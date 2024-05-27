import serial
import time
import requests

# Set up the serial port connection
arduino_port = "COM8"  # Example for Linux. For Windows, it might be "COM3" or similar.
baud_rate = 9600  # Should match the baud rate set in the Arduino sketch

# Create a serial connection
ser = serial.Serial(arduino_port, baud_rate, timeout=1)

time.sleep(2)  # Wait for the serial connection to initialize

# Read data from the Arduino
try:
    while True:
        if ser.in_waiting > 0:
            line = ser.readline().decode('utf-8').rstrip()  # Read a line and decode it to a string
            # print(line)
            if line == "AAP":
                response = requests.post(url="http://192.168.206.1:3000/?transaction=Aap")
                print(response.text)
                print("Aap")
            elif line == "BJP":
                response = requests.post(url="http://192.168.206.1:3000/?transaction=Bjp")
                print("BJP")
                print(response.text)
            elif line == "Congress":
                response = requests.post(url="http://192.168.206.1:3000/?transaction=Congress")
                print(response.text)
                print("Congress")
                
except KeyboardInterrupt:
    print("Exiting...")

# Close the serial connection
ser.close()