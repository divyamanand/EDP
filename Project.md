# Inventory Management System

## Objective
To develop a cost-efficient inventory management system.

---

## Scope

### 1. Inventory Management
- **Stock Tracking**: Maintain an up-to-date record of all medical equipment, medications, and consumables.
- **Automated Alerts**: Generate alerts for low stock levels, expiration dates, and replenishment requirements.
- **Procurement Management**: Simplify the procurement process for inventory, ensuring cost efficiency and timely restocking.
- **Usage Analytics**: Provide detailed reports and analytics on inventory usage to identify trends and optimize resources.
- **Waste Reduction**: Minimize waste by monitoring expiry dates and ensuring proper utilization of inventory items.
---

## Team
- **Harshil Malani** (22CS102)  
- **Vishal Maruti Mukkannavar** (22BSM067)  
- **Ayush Maurya** (22BEC023)  
- **Shubham Nagar** (22BEC115)  
- **Divyam Anand** (22BSM017)  
- **Revanth Mourya** (22BSM042)  

---

## Inventory Management Plan

1. Captures perishability of this life-saving product through the use of arc multipliers.
2. Contains discarding costs associated with waste/disposal.
3. Handles uncertainty associated with demand points.
4. Assesses costs associated with shortages/surpluses at the demand points.
5. Quantifies the supply-side risk associated with procurement.

---
![Hospital Management System Flow](https://github.com/user-attachments/assets/be8d710a-f265-4048-b6f8-6a1f51d51139)
---
![image](https://github.com/user-attachments/assets/4bfb9535-03cd-4a1b-a041-8fe358c75aec)

### IoT Based System

| **Component**         | **Specification**                         | **Purpose**                                       |
|------------------------|-------------------------------------------|--------------------------------------------------|
| **Arduino Uno**        | ATmega328P microcontroller                | Acts as the main controller for the system.      |
| **Node MCU**           | ESP8266 Wi-Fi module                     | Enables wireless connectivity and IoT integration.|
| **GSM Module**         | SIM800 or SIM900 GSM module               | Sends SMS alerts or enables remote communication.|
| **Temperature Sensor** | LM35 or DHT11                             | Measures ambient temperature for monitoring.     |
| **LCD Display**        | 16x2 or 20x4 LCD screen                   | Displays data such as temperature or system status. |
| **Load Cell**          | Strain gauge-based load sensor            | Measures weight or force applied on the system.  |


### Robot based Delivery System

| **Component**          | **Specification**                                                     | **Purpose**                                |
|-------------------------|----------------------------------------------------------------------|--------------------------------------------|
| **Chassis and Frame**   | Sturdy, lightweight aluminum or composite material frame            | Provides durability and portability.       |
| **Motors**              | High-torque DC motors or stepper motors                              | Enables precise movement.                  |
| **Wheels or Tracks**    | Omni-directional wheels or tracks                                    | Ensures smooth navigation and tight turns. |
| **Batteries**           | High-capacity lithium-ion or LiFePO4 batteries                      | Provides extended operational time.        |
| **LIDAR**               | For mapping, localization, and obstacle detection                   | Enables navigation and obstacle avoidance. |
| **Ultrasonic Sensors**  | For close-range obstacle detection and avoidance                    | Enhances safety during movement.           |
| **Inertial Measurement Unit (IMU)** | Tracks orientation and movement                          | Ensures stable and accurate navigation.    |
| **Wheel Encoders**      | For precise movement tracking and navigation                        | Improves positional accuracy.              |
| **Proximity Sensors**   | Detect objects or humans nearby                                     | Ensures safe interaction and operation.    |
| **Microcontroller**     | High-performance microcontroller (e.g., Arduino, STM32, or ESP32)   | Controls and processes all robot components and sensors. |


# Hybrid System Code for NodeMCU, Arduino Cloud, and Sensors

## 1. **NodeMCU Connection** (`nodemcu_connection.ino`)

```cpp
#include <ESP8266WiFi.h>

// Wi-Fi credentials
const char* ssid = "Your_WiFi_SSID";
const char* password = "Your_WiFi_Password";

void setupNodeMCU() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void loopNodeMCU() {
  // Placeholder for Wi-Fi-related tasks
}
```

## 2. Temperature Sensor Code

```cpp
#include <DHT.h>

#define DHTPIN 2       // Pin connected to the sensor
#define DHTTYPE DHT11  // Sensor type: DHT11 or DHT22

DHT dht(DHTPIN, DHTTYPE);

void setupTemperatureSensor() {
  dht.begin();
  Serial.println("Temperature Sensor Initialized");
}

float readTemperature() {
  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    Serial.println("Failed to read temperature");
    return 0.0;
  }
  return temperature;
}

void loopTemperatureSensor() {
  float temp = readTemperature();
  Serial.print("Temperature: ");
  Serial.println(temp);
  delay(2000);
}

```

## 3. GSM Module Code

```cpp
#include <SoftwareSerial.h>

SoftwareSerial gsmSerial(10, 11); // RX, TX pins for GSM module

void setupGSM() {
  gsmSerial.begin(9600);
  Serial.println("GSM Module Initialized");
}

void sendSMS(String message) {
  gsmSerial.println("AT+CMGF=1"); // Set SMS to text mode
  delay(100);
  gsmSerial.println("AT+CMGS=\"+1234567890\""); // Replace with recipient's number
  delay(100);
  gsmSerial.println(message);
  delay(100);
  gsmSerial.write(26); // Send Ctrl+Z to send SMS
  delay(1000);
  Serial.println("SMS Sent");
}

void loopGSM() {
  // Placeholder for GSM tasks
}
```
## 4. LCD Display Code

```cpp
#include <LiquidCrystal.h>

LiquidCrystal lcd(7, 8, 9, 10, 11, 12); // RS, EN, D4, D5, D6, D7

void setupLCD() {
  lcd.begin(16, 2); // Initialize LCD (16x2)
  lcd.print("LCD Initialized");
  delay(2000);
}

void displayData(String data) {
  lcd.clear();
  lcd.print(data);
}

void loopLCD() {
  // Example display loop
  displayData("Hello, World!");
  delay(2000);
}

```

## 5. Load Cell Code

```cpp
#include <HX711.h>

#define LOADCELL_DOUT_PIN 3
#define LOADCELL_SCK_PIN 4

HX711 scale;

void setupLoadCell() {
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  Serial.println("Load Cell Initialized");
}

float readWeight() {
  if (scale.is_ready()) {
    float weight = scale.get_units(10);
    return weight;
  } else {
    Serial.println("Load Cell Not Ready");
    return 0.0;
  }
}

void loopLoadCell() {
  float weight = readWeight();
  Serial.print("Weight: ");
  Serial.println(weight);
  delay(1000);
}

```

## 6. Cloud
```cpp
#include <WiFiClient.h>
#include <ArduinoIoTCloud.h>
#include <Arduino_ConnectionHandler.h>

// Wi-Fi credentials
const char* ssid = "Your_WiFi_SSID";
const char* password = "Your_WiFi_Password";

// Arduino IoT Cloud variables
float temperature;
float weight;

void onTemperatureChange() {
  Serial.print("Updated Temperature: ");
  Serial.println(temperature);
}

void onWeightChange() {
  Serial.print("Updated Weight: ");
  Serial.println(weight);
}

void setupArduinoCloud() {
  ArduinoCloud.begin(ArduinoIoTPreferredConnection(ssid, password));
  ArduinoCloud.addProperty(temperature, READWRITE, ON_CHANGE, onTemperatureChange);
  ArduinoCloud.addProperty(weight, READWRITE, ON_CHANGE, onWeightChange);

  Serial.println("Arduino Cloud Connected");
}

void loopArduinoCloud() {
  ArduinoCloud.update();
  // Send updated sensor data
  temperature = readTemperature();
  weight = readWeight();
}

```

## 7. Main

```cpp
// Include all component files
#include "nodemcu_connection.ino"
#include "temperature_sensor.ino"
#include "gsm_module.ino"
#include "lcd_display.ino"
#include "load_cell.ino"
#include "arduino_cloud.ino"

void setup() {
  Serial.begin(115200);

  // Initialize all components
  setupNodeMCU();
  setupTemperatureSensor();
  setupGSM();
  setupLCD();
  setupLoadCell();
  setupArduinoCloud();

  Serial.println("System Initialized");
}

void loop() {
  // Run loops for all components
  loopNodeMCU();
  loopTemperatureSensor();
  loopGSM();
  loopLCD();
  loopLoadCell();
  loopArduinoCloud();

  delay(1000); // General delay for stability
}

```
