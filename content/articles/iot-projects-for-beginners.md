---
title: 25 Best IoT Projects for Beginners to Build in 2026
seoTitle: 25 IoT Projects for Beginners to Build in 2026
description: 25 beginner IoT projects in three levels, from a Wi-Fi LED to a Matter sensor, with the board, parts and skills for each, plus common beginner mistakes.
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
  - projects
  - beginners
  - esp32
  - arduino
  - raspberry pi
  - electronics
tocDepth: 2
---

An **Internet of Things (IoT) project** is a small device that senses something, does something, or both, and talks to other computers over a network. The fastest way to learn IoT is to build a series of small, complete projects, each adding one new idea: first a sensor, then Wi-Fi, then a dashboard, then alerts, then battery power, then security.

This list gives you **25 projects in three levels**. Each one says what you build, the board and parts, the skills it teaches, and a stretch goal. You do not need an engineering degree. You need a microcontroller board, a breadboard, some jumper wires, a USB cable and a few cheap sensors.

**The short answer.** If you are starting in 2026, buy an **ESP32 development board** (Wi-Fi and Bluetooth built in, programmable with the Arduino IDE, MicroPython or ESPHome) and a small sensor kit. Build projects 1 to 8 in order. Add a **Raspberry Pi** only when you need an always-on computer for a dashboard, database or home hub.

**How we wrote this.** Board features and service limits are taken from the makers' own documentation and pricing pages, checked on 3 November 2026 and linked in the text. Common beginner problems come from public forum threads, which we cite as individual experiences, not proof. We did not build every project for this article. Treat the parts lists as starting points and check each part's datasheet before wiring.

## Which board should a beginner buy?

Most beginner IoT projects use one of three kinds of board. A **microcontroller** runs one program with no operating system, starts instantly and uses little power. A **single-board computer** runs Linux, so it can host a database, web server or home hub, but it needs a clean shutdown and more power.

| Board | Type | Built-in wireless | Best for | Watch out for |
|---|---|---|---|---|
| ESP32 dev board (ESP32, ESP32-C3, ESP32-C6, ESP32-S3) | Microcontroller | Wi-Fi, Bluetooth LE; C6 also Thread/Zigbee radio | Almost every sensor project in this list | 3.3 V pins; dev boards vary in pin layout |
| Arduino UNO R4 WiFi | Microcontroller | Wi-Fi and Bluetooth through an ESP32-S3 module | Beginners who want the classic UNO layout and Arduino's tutorials | Fewer pins and less speed than a bare ESP32 |
| Raspberry Pi Pico 2 W | Microcontroller | 2.4 GHz Wi-Fi, Bluetooth 5.2 | MicroPython learners on a budget | Smaller ecosystem of IoT examples than ESP32 |
| Raspberry Pi 5 (or a Pi 4 you already own) | Single-board computer | Wi-Fi, Bluetooth, Gigabit Ethernet | Hubs, dashboards, databases, cameras | Price, power supply, SD card wear |

A few facts behind the table:

- Espressif describes the **ESP32-C6** as its first Wi-Fi 6 chip, with Bluetooth LE and an IEEE 802.15.4 radio for Thread and Zigbee, and says it can be used for Matter devices ([Espressif](https://www.espressif.com/en/products/socs/esp32-c6)). The newer **ESP32-C5** adds 5 GHz Wi-Fi 6 ([Espressif](https://www.espressif.com/en/products/socs/esp32-c5)).
- The **Arduino UNO R4 WiFi** pairs a Renesas RA4M1 main chip with an ESP32-S3 module for wireless, and Arduino warns that the ESP32's header is 3.3 V only ([Arduino docs](https://docs.arduino.cc/hardware/uno-r4-wifi/)).
- The **Pico 2 W** launched in November 2024 at $7, with the RP2350 chip and the same wireless chip as the original Pico W ([Raspberry Pi](https://www.raspberrypi.com/news/raspberry-pi-pico-2-w-on-sale-now/)).
- **Raspberry Pi 5 prices have risen several times** since late 2025 because of the memory shortage. Raspberry Pi kept the 1 GB Pi 5 at $45 but raised the larger models ([Raspberry Pi](https://www.raspberrypi.com/news/more-memory-driven-price-rises/)); its product page listed the 16 GB model at $305 in November 2026 ([Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/)). For a home hub, the smallest model that runs your software is usually enough, and an old Pi 4 or a used mini PC can do the same job.

**Our suggested starter kit:** an ESP32 dev board, a breadboard and jumper wires, a BME280 or DHT22 temperature and humidity sensor, a PIR motion sensor, a capacitive soil moisture sensor, a reed switch with a magnet, a small OLED display (SSD1306), an active buzzer, a few LEDs and 220–330 Ω resistors, and a 5 V relay module for low-voltage loads.

## Before you start: five rules that prevent most failures

1. **Check the voltage.** ESP32, Pico and Raspberry Pi pins work at 3.3 V and are not 5 V tolerant. A sensor that outputs 5 V (such as the classic HC-SR04 ultrasonic sensor) needs a voltage divider or level shifter on its output.
2. **Use a good USB cable and power supply.** When an ESP32 turns on Wi-Fi it draws a short burst of current. On forums, the most common fix for random "brownout" resets is a better cable, port or supply, sometimes with a capacitor near the board ([ESP32 forum thread](https://esp32.com/viewtopic.php?p=21162)). Disabling the brownout detector usually just moves the crash elsewhere.
3. **Never wire mains electricity.** Every relay project here switches **low-voltage** loads (a 12 V LED strip, a pump, a fan). To control a lamp or heater, use a certified smart plug instead.
4. **Keep secrets out of your code.** Put Wi-Fi passwords and API keys in a separate file (for example `secrets.h` or ESPHome's `secrets.yaml`) and add it to `.gitignore` before you push to GitHub.
5. **Build in small steps.** Get the sensor printing to the serial monitor first, then add Wi-Fi, then the cloud. When something breaks, you will know which step broke it.

## Level 1: First connected devices (projects 1–8)

These projects teach the four basics: reading a sensor, controlling an output, joining Wi-Fi and serving or sending data.

### 1. Wi-Fi LED controlled from a web page

**What you build:** the ESP32 joins your Wi-Fi and serves a tiny web page with "On" and "Off" buttons that switch an LED.
**Parts:** ESP32, LED, 220 Ω resistor.
**Skills:** digital output, joining Wi-Fi, a basic HTTP server, finding a device's IP address.
**Stretch goal:** add a slider that sets the brightness with PWM (pulse-width modulation).

### 2. Room temperature and humidity monitor

**What you build:** a sensor that reads temperature and humidity every minute and shows them on a web page.
**Parts:** ESP32 and a **BME280** (temperature, humidity and pressure over I²C) or a DHT22.
**Skills:** the I²C bus, sensor libraries, rounding and units.
**Why the BME280:** the DHT11, found in many kits, has a coarse ±2 °C temperature accuracy and ±5 % humidity accuracy in common datasheets, which is fine for learning but not for comparing rooms. The DHT22 and BME280 are more accurate.
**Stretch goal:** add a small OLED display so the device works without a phone.

### 3. Plant soil moisture alert

**What you build:** a probe in a plant pot that turns on an LED or sends a message when the soil gets dry.
**Parts:** ESP32 and a **capacitive** soil moisture sensor.
**Skills:** analog input, calibration (record a "dry" and a "wet" value and map between them), thresholds with hysteresis so the alert does not flicker.
**Watch out:** cheap **resistive** probes pass current through bare metal and corrode in damp soil; capacitive probes avoid that ([freeCodeCamp](https://www.freecodecamp.org/news/how-to-use-a-resistive-soil-moisture-sensor/)). On the original ESP32, use an ADC1 pin (GPIO 32–39) for analog sensors, because ADC2 is shared with the Wi-Fi radio ([Espressif ESP-IDF docs](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/adc/adc_oneshot.html)).

### 4. Door or window open sensor

**What you build:** a reed switch on a door frame and a magnet on the door; the device reports "open" or "closed".
**Parts:** ESP32, reed switch, magnet.
**Skills:** digital input, the internal pull-up resistor, debouncing, sending a message only when the state changes.
**Stretch goal:** record how long the door was open.

### 5. Motion-triggered night light

**What you build:** a PIR (passive infrared) sensor that turns on an LED strip for two minutes when someone walks past in the dark.
**Parts:** ESP32, PIR sensor (such as the HC-SR501), light sensor (LDR or BH1750), MOSFET module or relay for a 12 V LED strip.
**Skills:** combining two sensors, timers with `millis()` instead of `delay()`, switching a larger load safely.

### 6. Send sensor data to a free cloud dashboard

**What you build:** your project 2 sensor posts readings to a cloud service that draws charts.
**Options:** [ThingSpeak](https://thingspeak.mathworks.com/pages/license_faq) (free for non-commercial use, with a limit of about 3 million messages a year and one update every 15 seconds per channel), [Arduino Cloud](https://cloud.arduino.cc/plans/) (the free plan allows 2 "Things" with 5 variables each and keeps 1 day of data), or [Blynk](https://blynk.io/pricing) (free plan with a phone app; check the current device and message limits).
**Skills:** HTTP requests or MQTT, API keys, rate limits.
**Tip:** free tiers change. Check the limits before you design around them, and send data every minute rather than every second.

### 7. Phone alert with a Telegram bot

**What you build:** your door sensor or soil sensor sends a Telegram message to your phone.
**Parts:** any Wi-Fi board from the list.
**Skills:** HTTPS from a microcontroller, bot tokens, avoiding message floods (send one alert, then wait before sending another).
**Stretch goal:** reply to the bot with "/status" to get the latest reading.

### 8. Learn MQTT with a local broker

**What you build:** install the Mosquitto MQTT broker on a Raspberry Pi or laptop, then have two ESP32 boards talk through it: one publishes a temperature, the other subscribes and lights an LED when it is too hot.
**Skills:** **MQTT**, the lightweight publish/subscribe protocol used by much of IoT: topics, QoS levels, retained messages and the "last will" message that tells others a device went offline ([MQTT.org](https://mqtt.org/), [Eclipse Mosquitto](https://mosquitto.org/)).
**Why it matters:** once you understand MQTT, connecting devices to Home Assistant, Node-RED or a cloud platform becomes much easier.

## Level 2: Useful home and hobby projects (projects 9–17)

These projects connect several sensors, store data and integrate with other systems.

### 9. Home Assistant sensor with ESPHome

**What you build:** you describe your sensor in a short YAML file, and [ESPHome](https://esphome.io/) compiles the firmware and connects the device to [Home Assistant](https://www.home-assistant.io/) automatically.
**Parts:** ESP32 and any supported sensor (BME280, PIR, reed switch).
**Skills:** declarative configuration, over-the-air (OTA) updates, encrypted API keys.
**Why beginners like it:** you get a working smart-home sensor with very little code, then learn the C++ underneath later.

### 10. Indoor air quality monitor

**What you build:** a monitor that shows CO₂ and fine dust (PM2.5) levels and turns an LED red when a room needs fresh air.
**Parts:** ESP32, an NDIR CO₂ sensor such as the Sensirion SCD40/SCD41 or SenseAir S8, and optionally a laser particle sensor such as the Plantower PMS5003.
**Skills:** UART and I²C sensors, averaging noisy readings, sensor warm-up time.
**Watch out:** cheap "MQ-135 air quality" modules do not measure CO₂ directly and need careful calibration. Use them for learning, not for decisions about health.

### 11. Smart plant watering system

**What you build:** project 3 plus a small 5 V or 12 V pump that runs for a few seconds when the soil is dry, with a water-level sensor so the pump never runs dry.
**Parts:** ESP32, capacitive soil sensor, relay or MOSFET module, small pump, float switch.
**Skills:** safety interlocks (max run time, minimum time between waterings), logging.

### 12. Weather station with a web dashboard

**What you build:** an outdoor station measuring temperature, humidity, pressure and light, publishing to your own dashboard.
**Parts:** ESP32, BME280, BH1750 light sensor, a ventilated radiation shield (or a well-ventilated box out of direct sun).
**Skills:** outdoor enclosures, sensor placement (a sensor in direct sun reads far too hot), data storage.
**Stretch goal:** store readings in InfluxDB and chart them in Grafana on a Raspberry Pi.

### 13. Battery-powered sensor with deep sleep

**What you build:** a sensor that wakes up every 10 minutes, sends one reading and goes back to sleep, running for months on batteries.
**Skills:** **deep sleep**, wake-up timers, measuring current, power budgets.
**What to know:** Espressif's datasheet gives the ESP32 chip a deep-sleep current in the microamp range, but many dev boards draw far more because of their USB chip, LEDs and voltage regulator ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)). For a real battery project, choose a board designed for low power.

### 14. Water tank level monitor

**What you build:** a sensor on top of a water tank that measures the distance to the water and reports how full it is.
**Parts:** ESP32 and a waterproof ultrasonic sensor (JSN-SR04T) or a time-of-flight sensor (VL53L1X).
**Skills:** converting distance to volume, filtering bad readings, 5 V to 3.3 V level shifting.

### 15. RFID door entry log

**What you build:** tap an RFID card on a reader; the device logs who tapped and when, and lights a green or red LED.
**Parts:** ESP32 or Arduino, MFRC522 reader, 13.56 MHz cards.
**Skills:** SPI, storing an allow-list, time from an NTP server.
**Watch out:** basic MIFARE Classic cards can be cloned, so treat this as an attendance log, not real security.

### 16. Smart energy monitor for one circuit

**What you build:** a **non-invasive** current clamp (such as the SCT-013) around one wire of an appliance cable estimates power use.
**Skills:** sampling an AC signal, calculating RMS current, calibration against a plug-in power meter.
**Safety:** the clamp goes around a single insulated conductor; you never open a socket or touch bare wires. If you are not sure, use a smart plug with built-in energy metering instead.

### 17. Bluetooth LE presence detection

**What you build:** an ESP32 scans for Bluetooth Low Energy (BLE) beacons, such as a key-finder tag, and reports which room you are in.
**Skills:** BLE scanning, signal strength (RSSI) and why it is noisy, privacy (only track devices you own).

## Level 3: Projects that look good in a portfolio (projects 18–25)

These combine networking, data and design. Each one is a good candidate for a GitHub repository with a README, a wiring diagram and photos.

### 18. Wireless sensor network with ESP-NOW

**What you build:** several battery sensors send readings directly to one ESP32 gateway using Espressif's **ESP-NOW** protocol, without joining a Wi-Fi network; the gateway forwards them over MQTT.
**Skills:** low-latency peer-to-peer messages, gateway design, packet structures ([Espressif ESP-NOW docs](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/network/esp_now.html)).

### 19. Long-range LoRa sensor

**What you build:** a sensor that sends small readings over **LoRa** radio for kilometres, received by your own gateway or a community network such as The Things Network.
**Skills:** radio regulations (duty-cycle limits in many regions), tiny payloads, airtime.
**Watch out:** The Things Network's fair-use policy limits each device to a small amount of uplink airtime per day, so design for a few readings an hour, not one a second ([The Things Network](https://www.thethingsnetwork.org/docs/lorawan/duty-cycle/)).

### 20. Smart doorbell with camera

**What you build:** a button press on an ESP32-CAM or ESP32-S3 camera board takes a photo and sends it to your phone.
**Skills:** camera configuration, image size versus speed, HTTPS uploads.
**Privacy:** point the camera at your own door, not a neighbour's property or a public path, and check local rules.

### 21. Matter or Thread smart sensor

**What you build:** a temperature or contact sensor on an ESP32-C6 or ESP32-H2 that joins Apple Home, Google Home, Amazon Alexa or Home Assistant through **Matter**, the cross-brand smart-home standard.
**Skills:** Matter commissioning, Thread networks, why standard device types matter.
**Context:** the Connectivity Standards Alliance released Matter 1.5 in November 2025, adding cameras, closures and energy features ([CSA](https://csa-iot.org/newsroom/matter-1-5-introduces-cameras-closures-and-enhanced-energy-management-capabilities/)). Start with Espressif's Matter examples ([ESP-Matter](https://github.com/espressif/esp-matter)) or ESPHome rather than writing the stack yourself.

### 22. Over-the-air firmware updates

**What you build:** a device that downloads and installs new firmware from your server or GitHub releases, with a check that rolls back if the new version fails.
**Skills:** OTA partitions, version numbers, signed firmware, why "update over Wi-Fi" is a security feature and a risk.

### 23. Self-hosted IoT dashboard on a Raspberry Pi

**What you build:** a Raspberry Pi running Mosquitto, Node-RED (for flows and alerts), InfluxDB (for time-series data) and Grafana (for charts), collecting data from your earlier projects.
**Skills:** Linux services, Docker or system packages, backups, network ports.
**Stretch goal:** reach it securely from outside your home with a VPN such as WireGuard or Tailscale instead of opening ports on your router.

### 24. Tiny machine learning on a microcontroller

**What you build:** an ESP32-S3 or Arduino board that recognises a gesture, a keyword or a machine's vibration pattern on the device itself, without sending raw data to the cloud.
**Skills:** collecting a dataset, training a small model (for example with [Edge Impulse](https://edgeimpulse.com/) or TensorFlow Lite for Microcontrollers), measuring accuracy honestly.
**Pairs well with:** our [machine learning projects](/articles/machine-learning-projects) list for the model-building side.

### 25. Secure-by-design IoT device

**What you build:** take one earlier project and harden it: unique passwords, TLS for MQTT, no secrets in the repository, OTA updates, and a short "security notes" section in the README.
**Skills:** the basics that consumer-IoT security standards ask for, such as no universal default passwords, a way to report vulnerabilities and keeping software updated ([ETSI EN 303 645](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf), [NIST IR 8259A](https://csrc.nist.gov/pubs/ir/8259/a/final)).
**Why it is on a beginner list:** good habits are easiest to build on your first projects.

## Choosing your platform and tools

| You want to... | Use |
|---|---|
| Learn C++ and electronics with lots of tutorials | Arduino IDE with an ESP32 or UNO R4 WiFi |
| Learn with Python | MicroPython on an ESP32 or Pico 2 W |
| Get a Home Assistant sensor working quickly | ESPHome on an ESP32 |
| Build professional-style firmware | ESP-IDF or PlatformIO |
| Run a hub, database or dashboard | Raspberry Pi with Raspberry Pi OS |

If you already know Python, our [25 Python projects for beginners](/articles/python-projects-for-beginners) and [Python automation scripts](/articles/python-automation-scripts) help with the Raspberry Pi side, and our [data visualization techniques](/articles/data-visualization-techniques) guide helps you design dashboards that are easy to read.

## Common beginner mistakes

- **Connecting a 5 V output to a 3.3 V pin.** It may work for a while, then damage the board.
- **Using `delay()` everywhere.** It freezes the whole program, so the device misses button presses and network messages. Use timers based on `millis()`.
- **Polling the cloud too often.** Free services rate-limit you. Most home sensors only need a reading every 30 to 60 seconds.
- **Power problems that look like software bugs.** Random resets often come from weak power, not your code.
- **Putting the temperature sensor next to the board.** The ESP32 itself gets warm; move the sensor a few centimetres away on wires.
- **Committing passwords to GitHub.** Use a secrets file and `.gitignore` from the first commit.
- **Skipping the README.** A photo, a wiring diagram and three lines on "how to run it" turn a hobby build into a portfolio piece.

## Where to go next

- For complete Arduino sketches, see our [15 Arduino IoT projects with source code](/articles/arduino-iot-projects).
- For a home hub, see our [20 Raspberry Pi smart home projects](/articles/raspberry-pi-smart-home-projects).
- For deployment-grade builds, see our [10 real-world ESP32 projects with sensors](/articles/esp32-iot-projects).
- For a final-year or capstone project, see our [30 IoT project ideas for engineering students](/articles/iot-project-ideas-for-final-year-students).
- To keep learning from people who build hardware, browse the [Engineering category](/category/engineering) of our blog directory and follow blogs with [RSS](/articles/follow-technical-blogs-with-rss).

## References

1. Espressif Systems. "ESP32-C6." [espressif.com](https://www.espressif.com/en/products/socs/esp32-c6)
2. Espressif Systems. "ESP32-C5." [espressif.com](https://www.espressif.com/en/products/socs/esp32-c5)
3. Espressif Systems. *ESP32 Series Datasheet*. [espressif.com](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
4. Espressif Systems. "ADC Oneshot Mode Driver." *ESP-IDF Programming Guide*. [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/adc/adc_oneshot.html)
5. Espressif Systems. "ESP-NOW." *ESP-IDF Programming Guide*. [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/network/esp_now.html)
6. Arduino. "UNO R4 WiFi." *Arduino Documentation*. [docs.arduino.cc](https://docs.arduino.cc/hardware/uno-r4-wifi/)
7. Arduino. "Arduino Cloud plans." Accessed 3 November 2026. [cloud.arduino.cc](https://cloud.arduino.cc/plans/)
8. Raspberry Pi Ltd. "Raspberry Pi Pico 2 W on sale now at $7." November 2024. [raspberrypi.com](https://www.raspberrypi.com/news/raspberry-pi-pico-2-w-on-sale-now/)
9. Raspberry Pi Ltd. "More memory-driven price rises." 2 February 2026. [raspberrypi.com](https://www.raspberrypi.com/news/more-memory-driven-price-rises/)
10. Raspberry Pi Ltd. "Raspberry Pi 5." Accessed 3 November 2026. [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-5/)
11. MathWorks. "ThingSpeak Licensing FAQ." [thingspeak.mathworks.com](https://thingspeak.mathworks.com/pages/license_faq)
12. Blynk. "Pricing." [blynk.io](https://blynk.io/pricing)
13. MQTT.org. "MQTT: The Standard for IoT Messaging." [mqtt.org](https://mqtt.org/)
14. Eclipse Foundation. *Eclipse Mosquitto*. [mosquitto.org](https://mosquitto.org/)
15. ESPHome. *ESPHome documentation*. [esphome.io](https://esphome.io/)
16. Connectivity Standards Alliance. "Matter 1.5 introduces cameras, closures, and enhanced energy management capabilities." November 2025. [csa-iot.org](https://csa-iot.org/newsroom/matter-1-5-introduces-cameras-closures-and-enhanced-energy-management-capabilities/)
17. The Things Network. "Duty cycle." [thethingsnetwork.org](https://www.thethingsnetwork.org/docs/lorawan/duty-cycle/)
18. ETSI. *EN 303 645: Cyber Security for Consumer Internet of Things: Baseline Requirements*. [etsi.org](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf)
19. NIST. *IR 8259A: IoT Device Cybersecurity Capability Core Baseline*. [csrc.nist.gov](https://csrc.nist.gov/pubs/ir/8259/a/final)
20. freeCodeCamp. "How to Use a Resistive Soil Moisture Sensor." [freecodecamp.org](https://www.freecodecamp.org/news/how-to-use-a-resistive-soil-moisture-sensor/)
21. ESP32 Forum. "Starting wifi trips brownout" (community thread). [esp32.com](https://esp32.com/viewtopic.php?p=21162)
