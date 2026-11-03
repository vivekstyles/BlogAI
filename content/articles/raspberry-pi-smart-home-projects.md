---
title: 20 Raspberry Pi IoT Projects for Smart Home Automation
seoTitle: 20 Raspberry Pi Smart Home Automation Projects
description: 20 Raspberry Pi smart home projects, from a Home Assistant hub and MQTT broker to Frigate cameras, local voice and energy dashboards, with safety notes.
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
  - raspberry pi
  - smart home
  - home automation
  - projects
  - home assistant
tocDepth: 2
---

A Raspberry Pi is a small Linux computer that can run all day on a few watts, which makes it a good **hub** for a smart home. It does not need to be the sensor itself. In most modern setups, the Pi runs the software that ties everything together: a home automation platform, a message broker, a database, a camera recorder or a voice assistant. Cheap ESP32 boards and off-the-shelf Zigbee or Matter devices do the sensing and switching.

This guide lists **20 Raspberry Pi projects for smart home automation**, roughly in the order you would build them. Most run on one Pi, and each one says what it does, what you need, how to set it up and what to watch out for.

**The short answer.** Start with **Home Assistant** on a Raspberry Pi 5 or 4 (project 1), add a **Zigbee or Thread radio** (project 3) so you can use inexpensive wireless sensors, then build automations for lighting, doors, climate and energy. Keep everything working locally, and use a VPN rather than open router ports for remote access.

**How we wrote this.** Hardware requirements, software features and prices come from the projects' own documentation and announcements, checked on 3 November 2026 and linked in the text. We did not build all 20 projects for this article. Where we report performance numbers from other people's tests, we say so.

## Which Raspberry Pi to use in 2026

Home Assistant's installation guide recommends a **Raspberry Pi 5 or Pi 4 with at least 2 GB of RAM**, a good A2-rated microSD card of 32 GB or more, and an official-spec power supply, not a phone charger or a computer USB port ([Home Assistant](https://www.home-assistant.io/installation/raspberrypi)).

Prices matter more than they used to. Raspberry Pi has raised the price of models with 2 GB or more of memory several times since late 2025 because memory chips became much more expensive; in February 2026 it said the 1 GB Pi 5 stays at $45 while larger models rose ([Raspberry Pi](https://www.raspberrypi.com/news/more-memory-driven-price-rises/)). By November 2026 the 16 GB Pi 5 was listed at $305 ([Raspberry Pi](https://www.raspberrypi.com/products/raspberry-pi-5/)). For a home hub, **4 GB is plenty for Home Assistant alone**; you only need more if you also run camera recording, databases or local AI on the same board. A Pi 4 you already own is still a capable hub.

**Storage.** The microSD card is the most common point of failure in always-on Pi projects. Our suggestion, beyond Home Assistant's minimum: if your hub becomes important, boot from an SSD (the Pi 5 supports NVMe drives through an M.2 HAT) and keep regular backups (project 20).

**GPIO note.** Raspberry Pi GPIO pins are 3.3 V and not 5 V tolerant. For Python GPIO code on a Pi 5, use the **gpiozero** library, which ships with Raspberry Pi OS; the older RPi.GPIO library does not work on the Pi 5's new RP1 input/output chip ([gpiozero docs](https://gpiozero.readthedocs.io/)).

| # | Project | Difficulty | Main software |
|---|---|---|---|
| 1 | Home automation hub | Easy | Home Assistant |
| 2 | MQTT broker for DIY devices | Easy | Mosquitto |
| 3 | Zigbee and Thread hub | Easy | ZHA or Zigbee2MQTT, Matter |
| 4 | Network-wide ad blocking | Easy | Pi-hole or AdGuard Home |
| 5 | Motion-activated lights | Easy | gpiozero, MQTT |
| 6 | Door left open alerts | Easy | Home Assistant automations |
| 7 | Whole-home climate dashboard | Medium | ESPHome, InfluxDB, Grafana |
| 8 | Smart air conditioner control | Medium | IR blaster, climate entity |
| 9 | Local AI security cameras | Hard | Frigate |
| 10 | Camera doorbell snapshots | Medium | Camera Module 3, notifications |
| 11 | Presence detection | Medium | Companion app, BLE |
| 12 | Local voice assistant | Medium | Assist, Wyoming |
| 13 | Energy monitoring | Medium | Energy dashboard |
| 14 | Wall-mounted touchscreen | Easy | Chromium kiosk |
| 15 | Weather-aware garden irrigation | Medium | Relay HAT, forecast |
| 16 | Automatic blinds | Easy | Zigbee or Matter motors |
| 17 | Wake-up and circadian lighting | Easy | Light automations |
| 18 | Leak and freeze alerts | Easy | Zigbee leak sensors |
| 19 | Secure remote access | Medium | WireGuard or Tailscale |
| 20 | Backups and power-cut protection | Medium | Backups, UPS HAT |

## Core infrastructure (projects 1–4)

### 1. Home Assistant hub

**What it does:** [Home Assistant](https://www.home-assistant.io/) is open-source home automation software that connects thousands of device brands, runs automations locally and gives you dashboards on the web and in a phone app.
**You need:** Raspberry Pi 5 or 4 (2 GB or more), A2 microSD card or SSD, official power supply, Ethernet cable.
**Setup:** use Raspberry Pi Imager to write **Home Assistant OS** to the card, boot the Pi, and open `http://homeassistant.local:8123` from a computer on the same network. The onboarding wizard finds many devices automatically.
**What you learn:** device discovery, entities (each sensor value or switch is an "entity"), automations, scenes and dashboards.
**Good to know:** Home Assistant releases monthly. Version 2026.10, released in early October 2026, redesigned the map and changed how automation triggers are picked ([release notes](https://www.home-assistant.io/changelogs/core-2026.10/)). Nabu Casa's optional paid remote-access service, Home Assistant Cloud, is being renamed **Home Assistant Link** ([Home Assistant blog](https://www.home-assistant.io/blog/2026/10/02/big-tech-ruined-the-cloud-so-were-renaming-ours/)); you do not need it for anything in this list.

### 2. MQTT broker for your DIY devices

**What it does:** MQTT is a lightweight publish/subscribe protocol; an MQTT **broker** passes messages between devices. Your ESP32 sensors publish readings to topics such as `home/kitchen/temperature`, and Home Assistant or Node-RED subscribe ([MQTT.org](https://mqtt.org/)).
**Setup on Home Assistant OS:** install the Mosquitto broker add-on and the MQTT integration.
**Setup on Raspberry Pi OS:**

```bash
sudo apt update
sudo apt install -y mosquitto mosquitto-clients
sudo mosquitto_passwd -c /etc/mosquitto/passwd homeuser
```

Then create `/etc/mosquitto/conf.d/local.conf`:

```text
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
```

Restart with `sudo systemctl restart mosquitto`. Since version 2.0, Mosquitto only accepts local connections until you configure a listener, which is why the file above is needed ([Mosquitto docs](https://mosquitto.org/documentation/)).
**Test it:** `mosquitto_sub -h localhost -u homeuser -P yourpassword -t 'home/#' -v`.
**Stretch goal:** add **Node-RED** for drag-and-drop flows, such as "if the garage door is open after 22:00, close it and send a message".

### 3. Zigbee and Thread hub

**What it does:** lets the Pi talk to inexpensive, battery-powered Zigbee sensors, bulbs and plugs from many brands, and to Thread devices that use **Matter**, the cross-brand smart home standard.
**You need:** a USB radio (coordinator) on a short USB extension cable to keep it away from the Pi's own interference, such as Home Assistant's Connect ZBT-1 or another coordinator supported by your software.
**Setup:** use Home Assistant's built-in **ZHA** integration, or **Zigbee2MQTT**, which publishes every Zigbee device to your MQTT broker and supports a very long list of devices ([Zigbee2MQTT](https://www.zigbee2mqtt.io/)). For Matter devices, add Home Assistant's Matter integration.
**Why Matter matters:** the Connectivity Standards Alliance released Matter 1.5 in November 2025, adding cameras, closures such as gates and garage doors, and energy management ([CSA](https://csa-iot.org/newsroom/matter-1-5-introduces-cameras-closures-and-enhanced-energy-management-capabilities/)). Matter devices work with Home Assistant, Apple Home, Google Home and Amazon Alexa, so you are less locked in.
**Tip:** mains-powered Zigbee devices (plugs, bulbs) act as routers and strengthen the mesh. Add some before you add many battery sensors.

### 4. Network-wide ad and tracker blocking

**What it does:** [Pi-hole](https://pi-hole.net/) acts as the DNS server for your home network and blocks requests to advertising and tracking domains for every device, including smart TVs and IoT gadgets that cannot run an ad blocker.
**Setup:** on Raspberry Pi OS, Pi-hole's documented installer is `curl -sSL https://install.pi-hole.net | bash` ([Pi-hole docs](https://docs.pi-hole.net/main/basic-install/)). Read a script before you pipe it to bash; the docs also explain how to download and inspect it first. Then set your router's DNS server to the Pi's address.
**On Home Assistant OS:** use the AdGuard Home add-on instead, since Home Assistant OS manages its own software.
**What you learn:** DNS, static IP addresses, DHCP, and how much "phone home" traffic smart devices generate. Looking at which domains your devices contact is a useful privacy audit in itself.
**Watch out:** if the Pi goes down, name lookups fail for the whole house. Configure a second DNS server or keep a fallback plan.

## Sensors, lights and alerts (projects 5–8)

### 5. Motion-activated hallway lights

**What it does:** a PIR motion sensor on the Pi's GPIO publishes motion events to MQTT, and Home Assistant turns on a hallway light at night.
**You need:** Raspberry Pi running Raspberry Pi OS, HC-SR501 PIR sensor (VCC to 5 V, GND to GND, OUT to GPIO 17; the module's output is about 3.3 V), the broker from project 2.
**Code:** install the MQTT library in a virtual environment (Raspberry Pi OS blocks system-wide `pip install`), then save this as `pir_mqtt.py`:

```bash
python3 -m venv --system-site-packages ~/pir-env
~/pir-env/bin/pip install paho-mqtt
```

```python
from signal import pause

import paho.mqtt.client as mqtt
from gpiozero import MotionSensor

BROKER = "localhost"
TOPIC = "home/hallway/motion"

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id="hallway-pir")
client.username_pw_set("homeuser", "yourpassword")
client.will_set(TOPIC + "/available", "offline", retain=True)
client.connect(BROKER, 1883)
client.loop_start()
client.publish(TOPIC + "/available", "online", retain=True)

pir = MotionSensor(17)
pir.when_motion = lambda: client.publish(TOPIC, "ON", retain=True)
pir.when_no_motion = lambda: client.publish(TOPIC, "OFF", retain=True)

pause()
```

`--system-site-packages` lets the virtual environment use the gpiozero copy that comes with Raspberry Pi OS. The code uses the version 2 callback API of paho-mqtt ([Eclipse Paho](https://eclipse.dev/paho/files/paho.mqtt.python/html/migrations.html)). The "will" message tells Home Assistant if the script dies.
**Run it on boot** with a systemd service:

```ini
# /etc/systemd/system/pir-mqtt.service
[Unit]
Description=Hallway PIR to MQTT
After=network-online.target
Wants=network-online.target

[Service]
User=pi
ExecStart=/home/pi/pir-env/bin/python /home/pi/pir_mqtt.py
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable it with `sudo systemctl enable --now pir-mqtt` (replace `pi` with your username).
**Simpler alternative:** a Zigbee motion sensor (project 3) does the same job without wiring, and can be placed anywhere.

### 6. "Door left open" alerts

**What it does:** sends a phone notification when an outside door, garage door or fridge has been open for more than 10 minutes.
**You need:** Home Assistant, a Zigbee contact sensor or a reed switch on an ESP32, and the Home Assistant Companion app on your phone.
**Automation:** you can build this in the visual editor, or in YAML:

```yaml
alias: Back door left open
triggers:
  - trigger: state
    entity_id: binary_sensor.back_door
    to: "on"
    for: "00:10:00"
actions:
  - action: notify.mobile_app_your_phone
    data:
      message: "The back door has been open for 10 minutes."
```

Replace the entity and notify service names with yours (Developer tools → States lists them). **What you learn:** triggers with durations, which avoid alerts for doors that are opened briefly. **Stretch goal:** repeat the alert every 10 minutes until the door is closed, and add a button in the notification to silence it.

### 7. Whole-home climate dashboard

**What it does:** records temperature and humidity in every room and shows long-term charts, so you can find damp rooms, cold spots or a radiator that is not working.
**You need:** a sensor per room. Zigbee climate sensors are the easiest; an ESP32 with a BME280 running [ESPHome](https://esphome.io/) costs little and integrates automatically.
**Data:** Home Assistant keeps recent history in its own database; for years of data, add the **InfluxDB** add-on and chart it in **Grafana**.
**What you learn:** time-series data, sampling rates, and why sensor placement matters (away from heaters, windows and direct sun).
**Stretch goal:** calculate dew point and alert when a room is at risk of condensation. Our [data visualization techniques](/articles/data-visualization-techniques) guide helps you choose clear charts.

### 8. Smart air conditioner or heater control

**What it does:** controls an existing split air conditioner or heat pump with infrared, the same way its remote does, so you can schedule it, switch it off when windows open, or pre-cool a room before you get home.
**You need:** an IR blaster supported by Home Assistant, or an ESP32 with an IR LED and receiver running ESPHome's climate IR components ([ESPHome climate IR](https://esphome.io/components/climate/climate_ir.html)).
**What you learn:** IR protocols, the "climate" entity type, and closed-loop control using a room temperature sensor.
**Safety:** do not rewire a wall thermostat or boiler unless you are qualified and it is allowed where you live. Mains and heating wiring mistakes can cause fires or damage expensive equipment. For heating, a certified smart thermostat with a Home Assistant integration is the safer route.

## Cameras, presence and voice (projects 9–12)

### 9. Local AI security cameras with Frigate

**What it does:** [Frigate](https://frigate.video/) is an open-source network video recorder that runs object detection on your camera streams locally, so you get alerts for "person" or "car" instead of every moving shadow, and no video leaves your home.
**You need:** IP cameras with RTSP streams, fast storage, and a detector. On a Raspberry Pi 5, Frigate supports **Hailo** AI accelerators, such as the Raspberry Pi AI HAT+ ([Frigate docs](https://docs.frigate.video/configuration/object_detectors/)). Jeff Geerling published a 2026 walkthrough of Frigate with Hailo detection on a Pi ([Jeff Geerling](https://www.jeffgeerling.com/blog/2026/frigate-with-hailo-for-object-detection-on-a-raspberry-pi/)).
**Be realistic:** a Pi 5 handles a few cameras. Many guides suggest a small Intel mini PC for larger systems; check Frigate's [recommended hardware](https://docs.frigate.video/frigate/hardware/) page before buying.
**Privacy and law:** point cameras at your own property, avoid neighbours' windows and public footpaths where you can, and check local rules on recording audio.

### 10. Camera doorbell snapshots

**What it does:** when someone presses a doorbell button, the Pi takes a still with a Camera Module and sends it to your phone.
**You need:** Raspberry Pi with Camera Module 3, a momentary push button on GPIO, and Home Assistant or a notification service.
**Code sketch:** gpiozero's `Button` triggers a function that saves a still with the Picamera2 library and publishes or uploads it ([Picamera2 manual](https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf)).
**What you learn:** camera configuration, image size versus speed, and sending images securely.
**Simpler alternative:** a doorbell camera with a supported Home Assistant integration, or Frigate (project 9) watching your door camera.

### 11. Presence detection

**What it does:** knows who is home so that automations can turn off lights and heating when everyone leaves and welcome you back.
**Methods, from most to least reliable in our view:** the Home Assistant Companion app's location and Wi-Fi network sensors; your router's list of connected devices (many routers have integrations); Bluetooth Low Energy beacons detected by ESPHome Bluetooth proxies for room-level presence; mmWave radar sensors for "someone is sitting still in this room".
**What you learn:** combining unreliable signals, delays before declaring "away", and privacy. Only track devices whose owners agree.

### 12. Local voice assistant

**What it does:** controls your home by voice, without sending audio to a cloud service.
**How it works:** Home Assistant's **Assist** turns speech into commands through a pipeline: wake word, speech-to-text, intent handling and text-to-speech. Local engines connect through the Wyoming protocol ([Home Assistant voice docs](https://www.home-assistant.io/voice_control/)). On a Pi, a closed-vocabulary engine such as **Speech-to-Phrase**, which only recognises commands it knows, is fast; full transcription with **Whisper** is slower on Pi hardware, according to several community guides.
**You need:** Home Assistant, a microphone and speaker device (Home Assistant sells a Voice Preview Edition; ESP32-S3 boards with microphones can also work).
**What you learn:** speech pipelines, latency, and the trade-off between accuracy and running everything locally.

## Energy, comfort and garden (projects 13–18)

### 13. Energy monitoring dashboard

**What it does:** shows how much electricity the house and individual appliances use, by hour, day and month, in Home Assistant's built-in **Energy dashboard** ([Home Assistant](https://www.home-assistant.io/docs/energy/)).
**Data sources:** smart plugs with energy metering for individual appliances; a clamp-on whole-home monitor installed by a qualified person; an optical reader on your meter's LED pulse output; or solar inverter and battery integrations.
**What you learn:** power (watts) versus energy (kilowatt-hours), cumulative sensors, and tariffs.
**Safety:** never open your consumer unit or meter. Pulse readers stick to the outside of the meter, and plug-in meters need no wiring.
**Stretch goal:** run the dishwasher or charge an e-bike when your tariff is cheapest or your solar panels are producing.

### 14. Wall-mounted touchscreen dashboard

**What it does:** a tablet-style control panel by the front door showing who is home, the weather, open doors and quick buttons.
**You need:** a Raspberry Pi with an official Touch Display or any HDMI touchscreen, Raspberry Pi OS, and Chromium in kiosk mode pointed at a Home Assistant dashboard.
**What you learn:** dashboard design for glanceable information, screen blanking, and creating a limited Home Assistant user for a shared device.
**Tip:** a separate Pi works well here, because a kiosk crashing should not take down your hub.

### 15. Weather-aware garden irrigation

**What it does:** waters the garden on a schedule, but skips a run when it has rained or rain is forecast.
**You need:** a relay HAT or relay board driving **24 V AC or 12 V DC irrigation solenoid valves** with their own transformer, Home Assistant's weather integration, and optionally a soil moisture sensor on an ESP32.
**What you learn:** schedules combined with conditions, fail-safe design (valves should close if the Pi crashes, so put a maximum run time in the automation and use normally-closed valves), and outdoor wiring.
**Safety:** low-voltage valves only. Keep the mains transformer in a weatherproof enclosure, installed to local rules.

### 16. Automatic blinds and curtains

**What it does:** opens blinds at sunrise, closes them on hot sunny afternoons to keep rooms cool, and closes them at sunset for privacy.
**You need:** Zigbee or Matter blind motors or curtain robots, or an ESP32 with a stepper motor for a DIY roller blind.
**What you learn:** the "cover" entity type, sun position triggers (Home Assistant knows sunrise and sunset for your location), and combining indoor temperature with sun elevation.

### 17. Wake-up and circadian lighting

**What it does:** slowly brightens bedroom lights before your alarm, and shifts the colour temperature of lights through the day: cooler and brighter in the morning, warmer and dimmer in the evening.
**You need:** smart bulbs that support colour temperature (Zigbee bulbs work well), Home Assistant automations or a community integration such as Adaptive Lighting.
**What you learn:** light transitions, scheduling relative to alarms (the Companion app can report your phone's next alarm) and scene design.

### 18. Leak and freeze alerts

**What it does:** sends a loud alert when water is detected under a sink, washing machine or water heater, or when a pipe area gets close to freezing.
**You need:** Zigbee water leak sensors and temperature sensors; optionally a motorised shut-off valve installed by a plumber.
**What you learn:** critical alerts (the Companion app can send notifications that bypass silent mode), sensor battery monitoring, and testing alarms regularly.
**Stretch goal:** close the main water valve automatically when a leak is detected and nobody is home.

## Keeping it running (projects 19–20)

### 19. Secure remote access

**What it does:** lets you check your home and get alerts while away **without** exposing your hub directly to the internet.
**Options:** a **WireGuard** VPN on the Pi or your router ([WireGuard](https://www.wireguard.com/)); **Tailscale**, a managed WireGuard-based service with an official Home Assistant add-on; or Nabu Casa's paid service (Home Assistant Link). The Companion app can switch between local and remote addresses automatically.
**Avoid:** port-forwarding port 8123, SSH or MQTT on your router. Exposed services are scanned constantly.
**Also do:** turn on two-factor authentication in your Home Assistant user profile, and use separate accounts for each person.

### 20. Backups and power-cut protection

**What it does:** makes sure a dead SD card or a power cut does not cost you months of configuration.
**Backups:** Home Assistant has built-in scheduled backups and can store them on a network share or in an off-site location ([Home Assistant backups](https://www.home-assistant.io/common-tasks/general/#backups)). Test a restore once, on a spare card, before you need it.
**Power:** a UPS HAT or a small UPS keeps the Pi running through short cuts and lets it shut down cleanly on long ones, which protects the storage.
**What you learn:** the "3-2-1" backup habit (three copies, two kinds of media, one off-site), and why always-on systems need maintenance plans.

## Security checklist for a Raspberry Pi smart home

- Change default passwords, use a password manager, and create separate users.
- Keep Raspberry Pi OS (`sudo apt update && sudo apt full-upgrade`) and Home Assistant up to date. Home Assistant's monthly release notes list breaking changes; read them before updating.
- Put IoT devices on a separate Wi-Fi network or VLAN if your router supports it.
- Prefer devices that work locally (Zigbee, Thread, Matter, ESPHome) over ones that depend on a vendor's cloud.
- Use MQTT usernames and passwords, and TLS if traffic leaves your home network.
- Look for devices whose makers commit to security updates and publish a way to report vulnerabilities, as consumer IoT security standards ask ([ETSI EN 303 645](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf)).

## Related reading

- New to IoT? Start with our [25 IoT projects for beginners](/articles/iot-projects-for-beginners).
- To build your own sensors for this hub, see our [15 Arduino IoT projects with source code](/articles/arduino-iot-projects) and [10 real-world ESP32 projects with sensors](/articles/esp32-iot-projects).
- Students can turn several of these into a capstone; see our [30 IoT project ideas for engineering students](/articles/iot-project-ideas-for-final-year-students).
- For scripting on the Pi, see our [Python automation scripts](/articles/python-automation-scripts).
- To follow people who write about Raspberry Pi and homelabs, browse the [Programming and Technology category](/category/programming-and-technology) of our blog directory.

## References

1. Home Assistant. "Raspberry Pi installation." [home-assistant.io](https://www.home-assistant.io/installation/raspberrypi)
2. Home Assistant. "Full changelog for Home Assistant 2026.10." [home-assistant.io](https://www.home-assistant.io/changelogs/core-2026.10/)
3. Home Assistant. "Big Tech ruined the cloud, so we're renaming ours." 2 October 2026. [home-assistant.io](https://www.home-assistant.io/blog/2026/10/02/big-tech-ruined-the-cloud-so-were-renaming-ours/)
4. Home Assistant. "Voice control." [home-assistant.io](https://www.home-assistant.io/voice_control/)
5. Home Assistant. "Home Energy Management." [home-assistant.io](https://www.home-assistant.io/docs/energy/)
6. Home Assistant. "General common tasks: backups." [home-assistant.io](https://www.home-assistant.io/common-tasks/general/#backups)
7. Raspberry Pi Ltd. "More memory-driven price rises." 2 February 2026. [raspberrypi.com](https://www.raspberrypi.com/news/more-memory-driven-price-rises/)
8. Raspberry Pi Ltd. "Raspberry Pi 5." Accessed 3 November 2026. [raspberrypi.com](https://www.raspberrypi.com/products/raspberry-pi-5/)
9. Raspberry Pi Ltd. *The Picamera2 Library* (manual). [datasheets.raspberrypi.com](https://datasheets.raspberrypi.com/camera/picamera2-manual.pdf)
10. gpiozero. *gpiozero documentation*. [gpiozero.readthedocs.io](https://gpiozero.readthedocs.io/)
11. Eclipse Paho. "Migrations" (paho-mqtt 2.0 callback API). [eclipse.dev](https://eclipse.dev/paho/files/paho.mqtt.python/html/migrations.html)
12. MQTT.org. "MQTT: The Standard for IoT Messaging." [mqtt.org](https://mqtt.org/)
13. Eclipse Foundation. "Mosquitto documentation." [mosquitto.org](https://mosquitto.org/documentation/)
14. Zigbee2MQTT. [zigbee2mqtt.io](https://www.zigbee2mqtt.io/)
15. Connectivity Standards Alliance. "Matter 1.5 introduces cameras, closures, and enhanced energy management capabilities." November 2025. [csa-iot.org](https://csa-iot.org/newsroom/matter-1-5-introduces-cameras-closures-and-enhanced-energy-management-capabilities/)
16. Pi-hole. "Basic install." [docs.pi-hole.net](https://docs.pi-hole.net/main/basic-install/)
17. ESPHome. "Climate IR." [esphome.io](https://esphome.io/components/climate/climate_ir.html)
18. Frigate. "Object Detectors." [docs.frigate.video](https://docs.frigate.video/configuration/object_detectors/)
19. Frigate. "Recommended hardware." [docs.frigate.video](https://docs.frigate.video/frigate/hardware/)
20. Geerling, J. "Frigate with Hailo for object detection on a Raspberry Pi." 2026. [jeffgeerling.com](https://www.jeffgeerling.com/blog/2026/frigate-with-hailo-for-object-detection-on-a-raspberry-pi/)
21. WireGuard. [wireguard.com](https://www.wireguard.com/)
22. ETSI. *EN 303 645: Cyber Security for Consumer Internet of Things: Baseline Requirements*. [etsi.org](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf)
