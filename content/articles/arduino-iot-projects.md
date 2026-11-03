---
title: 15 Arduino IoT Projects with Source Code for Students
seoTitle: 15 Arduino IoT Projects with Source Code (2026)
description: "15 Arduino IoT projects with full source code for ESP32 and UNO R4 WiFi: web servers, MQTT, ThingSpeak, Telegram alerts, ESP-NOW, deep sleep and OTA."
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-11-03
updatedAt: 2026-11-03
status: published
categories:
  - Engineering
  - Programming and Technology
tags:
  - iot
  - arduino
  - esp32
  - projects
  - source code
  - electronics
tocDepth: 2
---

These 15 Arduino IoT projects each come with **source code** you can paste into the Arduino IDE, the libraries it needs, the wiring and a stretch goal. They start with a web page that switches an LED and end with wireless sensor networks, battery-powered nodes and firmware updates over Wi-Fi. Together they cover the skills a student needs for a lab assignment, a mini project or the first step towards a final-year project.

**Which boards.** Most sketches target an **ESP32 development board** programmed with the Arduino IDE, because it has Wi-Fi and Bluetooth built in and is cheap. Projects 4 and 13 use the official **Arduino UNO R4 WiFi**, and the notes explain what to change for other boards. The Arduino Nano ESP32, an official Arduino board built on the ESP32-S3, runs the ESP32 sketches too ([Arduino docs](https://docs.arduino.cc/hardware/nano-esp32/)).

**How we wrote this.** Library calls were checked against each library's documentation and examples, and service limits against the providers' pages, on 3 November 2026. **We did not compile or run these sketches on hardware for this article.** Library versions change, so if a sketch fails to compile, read the first error, check the library version, and compare with the library's own examples. Each project is a starting point for your own work, not a finished product.

## Setup: do this once

1. Install **Arduino IDE 2** from [arduino.cc](https://www.arduino.cc/en/software).
2. For ESP32 boards, open **Boards Manager** and install **esp32 by Espressif Systems**. The sketches below are written for version 3.x of this core ([Arduino-ESP32 docs](https://docs.espressif.com/projects/arduino-esp32/en/latest/)). For the UNO R4 WiFi, install **Arduino UNO R4 Boards**.
3. Install libraries from **Library Manager** as each project lists them.
4. Create a tab called `secrets.h` in each sketch for passwords and keys, and never commit it:

```cpp
// secrets.h — keep this file out of Git (add it to .gitignore)
#pragma once
#define WIFI_SSID  "your-network"
#define WIFI_PASS  "your-password"
#define MQTT_USER  "student"
#define MQTT_PASS  "change-me"
```

**Two hardware rules.** ESP32 pins are 3.3 V and are not 5 V tolerant, so a 5 V sensor output needs a voltage divider. On the original ESP32, use ADC1 pins (GPIO 32–39) for analog sensors, because ADC2 is shared with Wi-Fi ([Espressif](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/adc/adc_oneshot.html)).

| # | Project | Board | Key skill |
|---|---|---|---|
| 1 | Web-controlled LED | ESP32 | HTTP server |
| 2 | Climate sensor with a JSON API | ESP32 | I²C, JSON |
| 3 | Log data to ThingSpeak | ESP32 | HTTP client, rate limits |
| 4 | MQTT temperature publisher | UNO R4 WiFi | MQTT publish |
| 5 | MQTT-controlled pump with a safety timer | ESP32 | MQTT subscribe |
| 6 | Telegram door alert | ESP32 | HTTPS, bots |
| 7 | Automatic plant watering | ESP32 | Calibration, interlocks |
| 8 | Motion alert to your phone with ntfy | ESP32 | Push notifications |
| 9 | Water tank level monitor | ESP32 | Filtering noisy data |
| 10 | RFID attendance logger | ESP32 | SPI, NTP time |
| 11 | Battery sensor with deep sleep | ESP32 | Power saving |
| 12 | ESP-NOW sensor network | ESP32 × 2 | Peer-to-peer radio |
| 13 | Arduino Cloud dashboard | UNO R4 WiFi | Cloud IoT platform |
| 14 | CO₂ monitor with OLED | ESP32 | Sensor plus display |
| 15 | Firmware updates over Wi-Fi | ESP32 | OTA updates |

## 1. Web-controlled LED

**What it does:** the ESP32 joins your Wi-Fi and serves a page with links that switch an LED on and off. Open the IP address printed in the Serial Monitor from a phone on the same network.
**Parts:** ESP32, LED, 220 Ω resistor (or the board's built-in LED).
**Libraries:** none beyond the ESP32 core.

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include "secrets.h"

const int LED_PIN = 2;   // many ESP32 dev boards have an LED on GPIO 2; check yours
WebServer server(80);
bool ledOn = false;

String page() {
  String html = "<!doctype html><meta name='viewport' content='width=device-width'>";
  html += "<h1>LED is ";
  html += ledOn ? "ON" : "OFF";
  html += "</h1><p><a href='/on'>Turn on</a> | <a href='/off'>Turn off</a></p>";
  return html;
}

void setLed(bool on) {
  ledOn = on;
  digitalWrite(LED_PIN, on ? HIGH : LOW);
  server.sendHeader("Location", "/");
  server.send(303);              // redirect back to the main page
}

void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print('.');
  }
  Serial.print("\nOpen http://");
  Serial.println(WiFi.localIP());

  server.on("/", [] { server.send(200, "text/html", page()); });
  server.on("/on", [] { setLed(true); });
  server.on("/off", [] { setLed(false); });
  server.begin();
}

void loop() {
  server.handleClient();
}
```

**What to learn from it:** how a device gets an IP address, how URLs map to handler functions, and why `loop()` must call `handleClient()` often. **Stretch goal:** change the links to a form that sends a POST request (state changes should not happen on GET in real apps), and add a PWM brightness slider with `analogWrite()`.

## 2. Climate sensor with a JSON API

**What it does:** reads a **BME280** temperature, humidity and pressure sensor over I²C and serves the readings as JSON at `/api/climate`, so a phone app, Python script or Home Assistant can read them.
**Parts:** ESP32, BME280 breakout (SDA to GPIO 21, SCL to GPIO 22, VCC to 3.3 V, GND to GND).
**Libraries:** Adafruit BME280 Library (and Adafruit Unified Sensor, installed with it).

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include "secrets.h"

Adafruit_BME280 bme;
WebServer server(80);

void handleClimate() {
  String json = "{\"temperature_c\":" + String(bme.readTemperature(), 1) +
                ",\"humidity_pct\":" + String(bme.readHumidity(), 1) +
                ",\"pressure_hpa\":" + String(bme.readPressure() / 100.0F, 1) + "}";
  server.send(200, "application/json", json);
}

void setup() {
  Serial.begin(115200);
  Wire.begin();                       // default ESP32 pins: SDA 21, SCL 22
  if (!bme.begin(0x76)) {             // some breakouts use 0x77
    Serial.println("BME280 not found. Check wiring and I2C address.");
    while (true) delay(1000);
  }
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  Serial.println(WiFi.localIP());

  server.on("/api/climate", handleClimate);
  server.begin();
}

void loop() {
  server.handleClient();
}
```

**Test it:** `curl http://<device-ip>/api/climate`. If you see "BME280 not found", run an I²C scanner sketch to find the address; also check that you did not buy a BMP280, which looks similar but has no humidity sensor. **Stretch goal:** read the JSON from a Python script and plot it, using ideas from our [data visualization techniques](/articles/data-visualization-techniques) guide.

## 3. Log sensor data to ThingSpeak

**What it does:** sends temperature and humidity to a [ThingSpeak](https://thingspeak.mathworks.com/) channel once a minute, where you get free charts.
**Limits:** the free ThingSpeak licence is for non-commercial use and allows about 3 million messages a year, with at most one update every 15 seconds per channel ([MathWorks](https://thingspeak.mathworks.com/pages/license_faq)). Sending once a minute stays well inside that.
**Libraries:** Adafruit BME280 Library. Add `#define THINGSPEAK_KEY "your-write-api-key"` to `secrets.h`.

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include "secrets.h"

const unsigned long SEND_EVERY_MS = 60000;
unsigned long lastSend = 0;
Adafruit_BME280 bme;

void sendReading() {
  float t = bme.readTemperature();
  float h = bme.readHumidity();
  if (isnan(t) || isnan(h)) return;

  String url = String("http://api.thingspeak.com/update?api_key=") + THINGSPEAK_KEY +
               "&field1=" + String(t, 1) + "&field2=" + String(h, 1);
  HTTPClient http;
  http.begin(url);
  int status = http.GET();
  String body = http.getString();   // ThingSpeak returns the new entry id, or "0" if rejected
  http.end();
  Serial.printf("HTTP %d, entry %s\n", status, body.c_str());
}

void setup() {
  Serial.begin(115200);
  Wire.begin();
  if (!bme.begin(0x76)) Serial.println("BME280 not found");
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  sendReading();
  lastSend = millis();
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) WiFi.reconnect();
  if (millis() - lastSend >= SEND_EVERY_MS) {
    lastSend = millis();
    sendReading();
  }
}
```

**Why `millis()` and not `delay(60000)`:** the loop stays free to do other work, and the subtraction `millis() - lastSend` keeps working when `millis()` wraps around after about 49 days. **Security note:** this uses plain HTTP, so the write key travels unencrypted; for anything beyond a class demo, use HTTPS or the official ThingSpeak library. **Stretch goal:** add a ThingSpeak "React" that emails you when the temperature passes a limit.

## 4. MQTT temperature publisher on the UNO R4 WiFi

**What it does:** reads a TMP36 analog temperature sensor and publishes the value every 30 seconds to an **MQTT** broker, such as Mosquitto running on a Raspberry Pi or laptop ([Mosquitto](https://mosquitto.org/)).
**Parts:** Arduino UNO R4 WiFi, TMP36 (left pin 5 V, middle pin A0, right pin GND).
**Libraries:** ArduinoMqttClient. `WiFiS3` comes with the UNO R4 board package.

```cpp
#include <WiFiS3.h>
#include <ArduinoMqttClient.h>
#include "secrets.h"

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

const char BROKER[] = "192.168.1.10";              // your broker's IP address
const int  PORT     = 1883;
const char TOPIC[]  = "home/livingroom/temperature";
const int  SENSOR_PIN = A0;
unsigned long lastSend = 0;

void connectMqtt() {
  mqttClient.setId("uno-r4-livingroom");
  mqttClient.setUsernamePassword(MQTT_USER, MQTT_PASS);
  while (!mqttClient.connect(BROKER, PORT)) {
    Serial.print("MQTT connection failed, error ");
    Serial.println(mqttClient.connectError());
    delay(5000);
  }
  Serial.println("MQTT connected");
}

void setup() {
  Serial.begin(115200);
  while (WiFi.begin(WIFI_SSID, WIFI_PASS) != WL_CONNECTED) {
    Serial.println("Retrying Wi-Fi...");
    delay(5000);
  }
  connectMqtt();
}

void loop() {
  mqttClient.poll();                      // keeps the connection alive
  if (!mqttClient.connected()) connectMqtt();

  if (millis() - lastSend >= 30000) {
    lastSend = millis();
    float volts = analogRead(SENSOR_PIN) * 5.0 / 1023.0;   // 10-bit reading, 5 V reference
    float tempC = (volts - 0.5) * 100.0;                   // TMP36: 10 mV per °C, 500 mV at 0 °C
    mqttClient.beginMessage(TOPIC, true);                  // true = retained message
    mqttClient.print(tempC, 1);
    mqttClient.endMessage();
    Serial.println(tempC, 1);
  }
}
```

**Test it:** on the broker machine, run `mosquitto_sub -h localhost -t 'home/#' -v -u student -P change-me`. A **retained** message means a new subscriber immediately gets the last value instead of waiting 30 seconds. **Stretch goal:** set a "last will" message so other devices learn when this one goes offline.

## 5. MQTT-controlled pump with a safety timer

**What it does:** subscribes to `home/garden/pump/set`. Sending `ON` turns a pump on through a MOSFET or relay module; sending `OFF` turns it off. A safety timer switches it off after 60 seconds even if the "OFF" message never arrives. The device reports its real state on `home/garden/pump/state`.
**Parts:** ESP32, logic-level MOSFET module or relay module rated for your pump, a 5–12 V DC pump with its own supply. **Do not switch mains voltage.**
**Libraries:** ArduinoMqttClient.

```cpp
#include <WiFi.h>
#include <ArduinoMqttClient.h>
#include "secrets.h"

const int PUMP_PIN = 26;
const unsigned long MAX_RUN_MS = 60000;
const char BROKER[] = "192.168.1.10";

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);
bool pumpOn = false;
unsigned long pumpStartedAt = 0;

void setPump(bool on) {
  pumpOn = on;
  digitalWrite(PUMP_PIN, on ? HIGH : LOW);
  if (on) pumpStartedAt = millis();
  mqttClient.beginMessage("home/garden/pump/state", true);
  mqttClient.print(on ? "ON" : "OFF");
  mqttClient.endMessage();
}

void onMessage(int size) {
  String payload;
  while (mqttClient.available()) payload += (char)mqttClient.read();
  payload.trim();
  if (payload == "ON") setPump(true);
  else if (payload == "OFF") setPump(false);
}

void connectMqtt() {
  mqttClient.setId("esp32-garden-pump");
  mqttClient.setUsernamePassword(MQTT_USER, MQTT_PASS);
  while (!mqttClient.connect(BROKER, 1883)) delay(5000);
  mqttClient.onMessage(onMessage);
  mqttClient.subscribe("home/garden/pump/set");
}

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);           // start with the pump off
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  connectMqtt();
  setPump(false);
}

void loop() {
  mqttClient.poll();
  if (!mqttClient.connected()) connectMqtt();
  if (pumpOn && millis() - pumpStartedAt >= MAX_RUN_MS) {
    Serial.println("Safety timer: pump off");
    setPump(false);
  }
}
```

**What to learn from it:** devices should fail safe. A lost network message must never leave a pump, heater or motor running. **Stretch goal:** add a float switch so the pump refuses to run when the tank is empty.

## 6. Telegram door alert

**What it does:** a reed switch on a door sends a Telegram message to your phone whenever the door opens or closes.
**Parts:** ESP32, reed switch (one leg to GPIO 27, the other to GND), magnet.
**Libraries:** UniversalTelegramBot and ArduinoJson. Create a bot with Telegram's @BotFather, then add `BOT_TOKEN` and your `CHAT_ID` to `secrets.h`.

```cpp
#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <UniversalTelegramBot.h>
#include "secrets.h"

const int DOOR_PIN = 27;
WiFiClientSecure client;
UniversalTelegramBot bot(BOT_TOKEN, client);

bool lastOpen = false;
unsigned long lastChange = 0;

void setup() {
  Serial.begin(115200);
  pinMode(DOOR_PIN, INPUT_PULLUP);       // closed switch pulls the pin LOW
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  client.setCACert(TELEGRAM_CERTIFICATE_ROOT);   // provided by the library
  lastOpen = digitalRead(DOOR_PIN) == HIGH;
  bot.sendMessage(CHAT_ID, "Door sensor online", "");
}

void loop() {
  bool open = digitalRead(DOOR_PIN) == HIGH;   // magnet away = switch open = HIGH
  if (open != lastOpen && millis() - lastChange > 200) {   // simple debounce
    lastOpen = open;
    lastChange = millis();
    bot.sendMessage(CHAT_ID, open ? "Front door OPENED" : "Front door closed", "");
  }
}
```

**What to learn from it:** HTTPS from a microcontroller, certificate checking, and debouncing a mechanical switch. **Watch out:** never put the bot token in a public repository; anyone with it can control your bot. **Stretch goal:** handle a `/status` command with `bot.getUpdates()` and reply with the current door state.

## 7. Automatic plant watering

**What it does:** reads a **capacitive** soil moisture sensor, and when the soil is dry, runs a pump for 5 seconds, then waits at least 6 hours before watering again. A float switch stops the pump if the reservoir is empty.
**Parts:** ESP32, capacitive soil sensor (analog out to GPIO 34), MOSFET or relay module (GPIO 26), small DC pump, float switch (GPIO 25 to GND).
**Libraries:** none.

```cpp
const int SOIL_PIN = 34;     // ADC1 pin, safe to use with Wi-Fi
const int PUMP_PIN = 26;
const int TANK_PIN = 25;     // float switch to GND; LOW = water present

// Calibrate: print the raw value with the probe in dry air and in a glass of water
const int DRY_RAW = 3000;
const int WET_RAW = 1300;
const int WATER_BELOW_PCT = 30;
const unsigned long PUMP_MS = 5000;
const unsigned long MIN_GAP_MS = 6UL * 60 * 60 * 1000;   // 6 hours

unsigned long lastWatered = 0;
bool everWatered = false;

int moisturePercent() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(SOIL_PIN);
    delay(5);
  }
  int raw = sum / 10;
  return constrain(map(raw, DRY_RAW, WET_RAW, 0, 100), 0, 100);
}

void setup() {
  Serial.begin(115200);
  pinMode(PUMP_PIN, OUTPUT);
  digitalWrite(PUMP_PIN, LOW);
  pinMode(TANK_PIN, INPUT_PULLUP);
}

void loop() {
  int moisture = moisturePercent();
  bool tankHasWater = digitalRead(TANK_PIN) == LOW;
  bool gapPassed = !everWatered || millis() - lastWatered >= MIN_GAP_MS;
  Serial.printf("Moisture %d%%, tank %s\n", moisture, tankHasWater ? "ok" : "EMPTY");

  if (moisture < WATER_BELOW_PCT && tankHasWater && gapPassed) {
    digitalWrite(PUMP_PIN, HIGH);
    delay(PUMP_MS);                       // short, bounded blocking is acceptable here
    digitalWrite(PUMP_PIN, LOW);
    lastWatered = millis();
    everWatered = true;
  }
  delay(60000);                          // check once a minute
}
```

**Why capacitive:** resistive probes corrode quickly in damp soil because current flows through bare metal ([freeCodeCamp](https://www.freecodecamp.org/news/how-to-use-a-resistive-soil-moisture-sensor/)). **Why the minimum gap:** soil takes time to absorb water, and without the gap a dry reading next to the probe could flood the pot. **Stretch goal:** publish moisture and watering events over MQTT (project 4) and chart them.

## 8. Motion alert to your phone with ntfy

**What it does:** a PIR motion sensor sends a push notification through [ntfy](https://docs.ntfy.sh/publish/), a simple publish-subscribe notification service, at most once every 5 minutes.
**Parts:** ESP32, HC-SR501 PIR sensor (VCC to 5 V, GND to GND, OUT to GPIO 14; its output is about 3.3 V).
**Libraries:** none. Install the ntfy app and subscribe to a long, hard-to-guess topic name, because anyone who knows a topic on the public server can read it. Add `#define NTFY_TOPIC "your-long-random-topic"` to `secrets.h`.

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "secrets.h"

const int PIR_PIN = 14;
const unsigned long COOLDOWN_MS = 5UL * 60 * 1000;
unsigned long lastAlert = 0;
bool alerted = false;

void notify(const char *message) {
  WiFiClientSecure client;
  client.setInsecure();     // encrypts but does not verify the server; add a root CA for real use
  HTTPClient http;
  http.begin(client, String("https://ntfy.sh/") + NTFY_TOPIC);
  http.addHeader("Title", "Motion detected");
  http.addHeader("Priority", "high");
  int status = http.POST(message);
  http.end();
  Serial.printf("ntfy HTTP %d\n", status);
}

void setup() {
  Serial.begin(115200);
  pinMode(PIR_PIN, INPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  delay(30000);             // PIR sensors need time to settle after power-up
}

void loop() {
  if (digitalRead(PIR_PIN) == HIGH && (!alerted || millis() - lastAlert >= COOLDOWN_MS)) {
    notify("Motion in the garage");
    lastAlert = millis();
    alerted = true;
  }
  delay(100);
}
```

**What to learn from it:** cooldowns prevent alert floods, and `setInsecure()` is a shortcut you should understand before using. ntfy can also be self-hosted on a Raspberry Pi. **Stretch goal:** only alert between 23:00 and 06:00, using NTP time from project 10.

## 9. Water tank level monitor

**What it does:** an ultrasonic sensor on top of a tank measures the distance to the water and converts it to a percentage. A median of five readings removes the odd bad echo.
**Parts:** ESP32, HC-SR04 or waterproof JSN-SR04T (TRIG to GPIO 5, ECHO through a voltage divider of 1 kΩ and 2 kΩ to GPIO 18, because ECHO outputs 5 V).
**Libraries:** none.

```cpp
const int TRIG_PIN = 5;
const int ECHO_PIN = 18;
const float EMPTY_CM = 120.0;   // distance from sensor to the bottom of the tank
const float FULL_CM  = 20.0;    // distance when the tank is full

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  unsigned long us = pulseIn(ECHO_PIN, HIGH, 30000);   // 30 ms timeout
  if (us == 0) return NAN;
  return us * 0.0343 / 2.0;     // speed of sound ~343 m/s at 20 °C, there and back
}

float medianDistance() {
  float r[5];
  int n = 0;
  for (int i = 0; i < 5; i++) {
    float d = readDistanceCm();
    if (!isnan(d)) r[n++] = d;  // keep only readings that got an echo
    delay(60);                  // let echoes die down between pings
  }
  if (n == 0) return NAN;
  for (int i = 1; i < n; i++) { // insertion sort
    float key = r[i];
    int j = i - 1;
    while (j >= 0 && r[j] > key) { r[j + 1] = r[j]; j--; }
    r[j + 1] = key;
  }
  return r[n / 2];
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  float d = medianDistance();
  if (isnan(d)) {
    Serial.println("No echo");
  } else {
    float pct = (EMPTY_CM - d) / (EMPTY_CM - FULL_CM) * 100.0;
    pct = constrain(pct, 0, 100);
    Serial.printf("Distance %.1f cm, tank %.0f%% full\n", d, pct);
  }
  delay(10000);
}
```

**What to learn from it:** real sensors give outliers, and a median filter is a simple, robust fix. The speed of sound changes with temperature by roughly 0.6 m/s per °C, so for better accuracy, correct it with a temperature reading. **Stretch goal:** publish over MQTT and alert when the level falls below 20 %.

## 10. RFID attendance logger

**What it does:** students tap an RFID card; the ESP32 prints a CSV line with the date, time, card ID and whether the card is on the allow-list, and lights a green or red LED.
**Parts:** ESP32, MFRC522 reader (SDA/SS to GPIO 5, SCK 18, MOSI 23, MISO 19, RST 22, 3.3 V power), 13.56 MHz cards, two LEDs.
**Libraries:** MFRC522 (by GithubCommunity).

```cpp
#include <WiFi.h>
#include <SPI.h>
#include <MFRC522.h>
#include <time.h>
#include "secrets.h"

const int SS_PIN = 5, RST_PIN = 22, GREEN = 32, RED = 33;
MFRC522 rfid(SS_PIN, RST_PIN);
const char *ALLOWED[] = {"04A1B2C3", "DEADBEEF"};   // replace with your card IDs

String uidHex() {
  String s;
  for (byte i = 0; i < rfid.uid.size; i++) {
    if (rfid.uid.uidByte[i] < 0x10) s += "0";
    s += String(rfid.uid.uidByte[i], HEX);
  }
  s.toUpperCase();
  return s;
}

bool isAllowed(const String &uid) {
  for (const char *id : ALLOWED) if (uid == id) return true;
  return false;
}

void setup() {
  Serial.begin(115200);
  pinMode(GREEN, OUTPUT);
  pinMode(RED, OUTPUT);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);
  configTzTime("IST-5:30", "pool.ntp.org");    // POSIX time zone string; change for your region
  SPI.begin();
  rfid.PCD_Init();
  Serial.println("date,time,card,allowed");
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;
  String uid = uidHex();
  bool ok = isAllowed(uid);
  struct tm now;
  char stamp[32] = "unknown,unknown";
  if (getLocalTime(&now)) strftime(stamp, sizeof(stamp), "%Y-%m-%d,%H:%M:%S", &now);
  Serial.printf("%s,%s,%s\n", stamp, uid.c_str(), ok ? "yes" : "no");

  digitalWrite(ok ? GREEN : RED, HIGH);
  delay(1000);
  digitalWrite(GREEN, LOW);
  digitalWrite(RED, LOW);
  rfid.PICC_HaltA();
}
```

**Tip:** IDs must be written exactly as `uidHex()` formats them (upper-case hex, no spaces), so tap each card once and copy its printed ID into the list. **Watch out:** cheap MIFARE Classic cards can be cloned, so this is an attendance log, not a lock. **Stretch goal:** save rows to a microSD card or post them to a Google Sheet through a web app.

## 11. Battery sensor with deep sleep

**What it does:** wakes every 10 minutes, takes one BME280 reading in "forced" mode, sends it, and returns to **deep sleep**. Almost all of the time the chip is asleep, which is what makes battery operation possible.
**Parts:** ESP32 board designed for low power (many dev boards waste current on their USB chip and power LED), BME280, battery and suitable regulator.
**Libraries:** Adafruit BME280 Library.

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <Wire.h>
#include <Adafruit_BME280.h>
#include "secrets.h"

const uint64_t SLEEP_SECONDS = 600;
RTC_DATA_ATTR uint32_t bootCount = 0;    // survives deep sleep
Adafruit_BME280 bme;

bool connectWifi(unsigned long timeoutMs) {
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - start > timeoutMs) return false;
    delay(100);
  }
  return true;
}

void setup() {
  Serial.begin(115200);
  bootCount++;
  Wire.begin();
  if (bme.begin(0x76)) {
    bme.setSampling(Adafruit_BME280::MODE_FORCED,
                    Adafruit_BME280::SAMPLING_X1, Adafruit_BME280::SAMPLING_X1,
                    Adafruit_BME280::SAMPLING_X1, Adafruit_BME280::FILTER_OFF);
    bme.takeForcedMeasurement();
    float t = bme.readTemperature();
    float h = bme.readHumidity();

    if (connectWifi(10000)) {             // give up after 10 s to save battery
      HTTPClient http;
      http.begin(String("http://api.thingspeak.com/update?api_key=") + THINGSPEAK_KEY +
                 "&field1=" + String(t, 1) + "&field2=" + String(h, 1) +
                 "&field3=" + String(bootCount));
      http.GET();
      http.end();
    }
  }
  WiFi.disconnect(true);
  WiFi.mode(WIFI_OFF);
  esp_sleep_enable_timer_wakeup(SLEEP_SECONDS * 1000000ULL);
  esp_deep_sleep_start();                 // the board restarts from setup() on wake-up
}

void loop() {}                            // never reached
```

**What to learn from it:** after deep sleep, the ESP32 restarts from `setup()`, and only variables marked `RTC_DATA_ATTR` survive. Espressif's datasheet gives the chip's deep-sleep current in microamps ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)), but your board's real current depends on its regulator and extra components, so measure it with a multimeter. **Stretch goal:** report battery voltage through a voltage divider on an ADC1 pin.

## 12. ESP-NOW sensor network

**What it does:** a sensor node sends readings directly to a gateway board with Espressif's **ESP-NOW** protocol, with no router involved ([Espressif ESP-NOW docs](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/network/esp_now.html)). This is how many low-power home sensor networks work.
**Parts:** two ESP32 boards, a BME280 on the sender.
**Libraries:** Adafruit BME280 Library. Written for ESP32 Arduino core 3.x, which changed the receive callback's signature from core 2.x.

Upload the receiver first and copy the MAC address it prints.

```cpp
// RECEIVER (gateway)
#include <WiFi.h>
#include <esp_now.h>

struct Reading {
  uint8_t  nodeId;
  float    tempC;
  float    humidity;
  uint32_t seq;
};

void onReceive(const esp_now_recv_info_t *info, const uint8_t *data, int len) {
  if (len != sizeof(Reading)) return;
  Reading r;
  memcpy(&r, data, sizeof(r));
  Serial.printf("node %u #%lu: %.1f C, %.1f %%\n", r.nodeId, (unsigned long)r.seq, r.tempC, r.humidity);
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  delay(100);
  Serial.print("Gateway MAC: ");
  Serial.println(WiFi.macAddress());
  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed");
    return;
  }
  esp_now_register_recv_cb(onReceive);
}

void loop() {}
```

```cpp
// SENDER (sensor node)
#include <WiFi.h>
#include <esp_now.h>
#include <Wire.h>
#include <Adafruit_BME280.h>

uint8_t GATEWAY_MAC[] = {0x24, 0x6F, 0x28, 0xAA, 0xBB, 0xCC};   // replace with the printed MAC

struct Reading {            // must match the receiver exactly
  uint8_t  nodeId;
  float    tempC;
  float    humidity;
  uint32_t seq;
};

Adafruit_BME280 bme;
Reading msg = {3, 0, 0, 0};

void setup() {
  Serial.begin(115200);
  Wire.begin();
  bme.begin(0x76);
  WiFi.mode(WIFI_STA);
  if (esp_now_init() != ESP_OK) {
    Serial.println("ESP-NOW init failed");
    return;
  }
  esp_now_peer_info_t peer = {};
  memcpy(peer.peer_addr, GATEWAY_MAC, 6);
  peer.channel = 0;        // use the current channel
  peer.encrypt = false;
  esp_now_add_peer(&peer);
}

void loop() {
  msg.tempC = bme.readTemperature();
  msg.humidity = bme.readHumidity();
  msg.seq++;
  esp_err_t result = esp_now_send(GATEWAY_MAC, (uint8_t *)&msg, sizeof(msg));
  Serial.println(result == ESP_OK ? "sent" : "send error");
  delay(10000);
}
```

**What to learn from it:** binary message structures, sequence numbers to detect lost packets, and radio channels. **Watch out:** if the gateway is also connected to your Wi-Fi router, both boards must use the router's channel. ESP-NOW payloads are small, so send structs, not text. **Stretch goal:** forward each reading from the gateway to MQTT, and put the sender into deep sleep between readings (project 11).

## 13. Arduino Cloud dashboard on the UNO R4 WiFi

**What it does:** uses **Arduino Cloud** to build a phone and web dashboard with a temperature chart and a fan switch, without writing any networking code.
**How it works:** in Arduino Cloud you create a "Thing", add cloud variables (here `temperature`, a read-only float, and `fan`, a read-write boolean), and the web editor generates `thingProperties.h` with the connection code. You write only the logic.
**Limits:** the free plan allows 2 Things with 5 variables each, keeps 1 day of data and allows 25 compilations a day; the Maker plan costs $72 a year ([Arduino Cloud plans](https://cloud.arduino.cc/plans/), checked 3 November 2026).

```cpp
#include "thingProperties.h"   // generated by Arduino Cloud

const int FAN_PIN = 7;          // to a transistor or relay module driving a small DC fan
const int SENSOR_PIN = A0;      // TMP36 as in project 4
unsigned long lastRead = 0;

void setup() {
  Serial.begin(9600);
  delay(1500);
  pinMode(FAN_PIN, OUTPUT);
  initProperties();
  ArduinoCloud.begin(ArduinoIoTPreferredConnection);
  setDebugMessageLevel(2);
  ArduinoCloud.printDebugInfo();
}

void loop() {
  ArduinoCloud.update();          // syncs variables with the cloud
  if (millis() - lastRead >= 10000) {
    lastRead = millis();
    float volts = analogRead(SENSOR_PIN) * 5.0 / 1023.0;
    temperature = (volts - 0.5) * 100.0;   // changing the variable sends it to the dashboard
  }
}

// Called by Arduino Cloud when the "fan" switch changes on the dashboard
void onFanChange() {
  digitalWrite(FAN_PIN, fan ? HIGH : LOW);
}
```

**What to learn from it:** how a managed IoT platform handles device identity, sync and dashboards for you, and what that costs in flexibility. Compare it with the self-built MQTT approach in projects 4 and 5. **Stretch goal:** add an automatic mode that switches the fan on above 28 °C.

## 14. CO₂ monitor with OLED display

**What it does:** shows CO₂, temperature and humidity on a small OLED and changes an LED from green to red when CO₂ is high, a common sign that a room needs ventilation.
**Parts:** ESP32, Sensirion **SCD40 or SCD41** CO₂ sensor and an SSD1306 128×64 I²C OLED (both on SDA 21 and SCL 22), red and green LEDs.
**Libraries:** SparkFun SCD4x Arduino Library, Adafruit SSD1306, Adafruit GFX.

```cpp
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include "SparkFun_SCD4x_Arduino_Library.h"

Adafruit_SSD1306 display(128, 64, &Wire, -1);
SCD4x co2Sensor;
const int GREEN = 32, RED = 33;
const uint16_t HIGH_PPM = 1200;   // our chosen alert level, not a health limit

void setup() {
  Serial.begin(115200);
  Wire.begin();
  pinMode(GREEN, OUTPUT);
  pinMode(RED, OUTPUT);
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) Serial.println("OLED not found");
  if (!co2Sensor.begin()) Serial.println("SCD4x not found");   // starts periodic measurement
  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
}

void loop() {
  if (co2Sensor.readMeasurement()) {        // true when a new reading is ready (about every 5 s)
    uint16_t co2 = co2Sensor.getCO2();
    float t = co2Sensor.getTemperature();
    float h = co2Sensor.getHumidity();

    display.clearDisplay();
    display.setTextSize(2);
    display.setCursor(0, 0);
    display.printf("%u ppm", co2);
    display.setTextSize(1);
    display.setCursor(0, 28);
    display.printf("%.1f C  %.0f %%RH", t, h);
    display.setCursor(0, 48);
    display.print(co2 >= HIGH_PPM ? "Open a window" : "Air OK");
    display.display();

    digitalWrite(GREEN, co2 < HIGH_PPM);
    digitalWrite(RED, co2 >= HIGH_PPM);
  }
  delay(500);
}
```

**What to learn from it:** two devices sharing one I²C bus, display layout and sensor warm-up. The SCD4x family uses **NDIR** (infrared) sensing and gives real CO₂ readings ([Sensirion](https://sensirion.com/products/catalog/SCD41)), unlike cheap MQ-135 modules. **Stretch goal:** log readings over a school day and compare rooms, with windows open and closed.

## 15. Firmware updates over Wi-Fi (OTA)

**What it does:** after the first USB upload, you can upload new sketches over Wi-Fi from the Arduino IDE. The board appears under **Tools → Port** as a network port.
**Libraries:** ArduinoOTA (included with the ESP32 core). Add `#define OTA_PASS "a-long-password"` to `secrets.h`.

```cpp
#include <WiFi.h>
#include <ArduinoOTA.h>
#include "secrets.h"

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASS);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  ArduinoOTA.setHostname("garden-node");
  ArduinoOTA.setPassword(OTA_PASS);       // without this, anyone on your network can flash the board
  ArduinoOTA.onStart([] { Serial.println("OTA update starting"); });
  ArduinoOTA.onEnd([] { Serial.println("\nOTA update done"); });
  ArduinoOTA.onError([](ota_error_t error) { Serial.printf("OTA error %u\n", error); });
  ArduinoOTA.begin();
  Serial.println(WiFi.localIP());
}

void loop() {
  ArduinoOTA.handle();     // must be called often
  // ... your normal project code, without long delay() calls ...
}
```

**What to learn from it:** OTA is essential for devices installed somewhere awkward, and it is also an attack surface, so always set a password and keep the device on a trusted network. **Stretch goal:** combine OTA with any earlier project, and read about signed firmware and rollback in Espressif's [OTA documentation](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/system/ota.html).

## How to present these projects

For a lab record, mini project or viva, examiners usually want to see that you understand the system, not just that it works. For each project:

- Draw a **block diagram**: sensor → microcontroller → network → server or app.
- Include a **wiring diagram** (Fritzing, KiCad or a clear hand drawing) and a photo.
- Explain **one design decision**, such as why you used MQTT instead of HTTP, or a median filter instead of an average.
- Show **measured results**: a chart of a day's readings, the battery current in deep sleep, or how many ESP-NOW packets arrived out of 100.
- List **limitations** honestly, such as sensor accuracy, plain HTTP or a cloneable RFID card.

Put the code on GitHub with a README, a `secrets.example.h` and a `.gitignore`. If you also write Python for the server side, our [Python projects for beginners](/articles/python-projects-for-beginners) and [Python automation scripts](/articles/python-automation-scripts) cover the basics.

## Common errors and fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| "Brownout detector was triggered" | Weak USB power when Wi-Fi starts | Better cable, port or supply; a capacitor near the board can help ([ESP32 forum](https://esp32.com/viewtopic.php?p=21162)) |
| Upload fails with "Failed to connect" | Board not in download mode | Hold BOOT while the upload starts |
| `analogRead()` returns 0 or 4095 with Wi-Fi on | ADC2 pin on the original ESP32 | Use GPIO 32–39 |
| Sensor "not found" | Wrong I²C address or wiring | Run an I²C scanner; check 0x76 vs 0x77 |
| Random wrong readings | Floating input pin | Use `INPUT_PULLUP` or a resistor |
| Compile errors in ESP-NOW callbacks | Core 2.x vs 3.x signature | Match your installed core's examples |

## Related reading

- New to IoT? Start with our [25 IoT projects for beginners](/articles/iot-projects-for-beginners).
- To host your MQTT broker and dashboards, see our [20 Raspberry Pi smart home projects](/articles/raspberry-pi-smart-home-projects).
- For field-ready builds, see our [10 real-world ESP32 projects with sensors](/articles/esp32-iot-projects).
- Planning a final-year project? See our [30 IoT project ideas for engineering students](/articles/iot-project-ideas-for-final-year-students).

## References

1. Arduino. "Nano ESP32." *Arduino Documentation*. [docs.arduino.cc](https://docs.arduino.cc/hardware/nano-esp32/)
2. Arduino. "Arduino IDE downloads." [arduino.cc](https://www.arduino.cc/en/software)
3. Arduino. "Arduino Cloud plans." Accessed 3 November 2026. [cloud.arduino.cc](https://cloud.arduino.cc/plans/)
4. Espressif Systems. *Arduino-ESP32 documentation*. [docs.espressif.com](https://docs.espressif.com/projects/arduino-esp32/en/latest/)
5. Espressif Systems. "ADC Oneshot Mode Driver." *ESP-IDF Programming Guide*. [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/adc/adc_oneshot.html)
6. Espressif Systems. "ESP-NOW." *ESP-IDF Programming Guide*. [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/network/esp_now.html)
7. Espressif Systems. "Over The Air Updates (OTA)." *ESP-IDF Programming Guide*. [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/system/ota.html)
8. Espressif Systems. *ESP32 Series Datasheet*. [espressif.com](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
9. MathWorks. "ThingSpeak Licensing FAQ." [thingspeak.mathworks.com](https://thingspeak.mathworks.com/pages/license_faq)
10. Eclipse Foundation. *Eclipse Mosquitto*. [mosquitto.org](https://mosquitto.org/)
11. ntfy. "Publishing." *ntfy documentation*. [docs.ntfy.sh](https://docs.ntfy.sh/publish/)
12. Sensirion. "SCD41." [sensirion.com](https://sensirion.com/products/catalog/SCD41)
13. freeCodeCamp. "How to Use a Resistive Soil Moisture Sensor." [freecodecamp.org](https://www.freecodecamp.org/news/how-to-use-a-resistive-soil-moisture-sensor/)
14. ESP32 Forum. "Starting wifi trips brownout" (community thread). [esp32.com](https://esp32.com/viewtopic.php?p=21162)
