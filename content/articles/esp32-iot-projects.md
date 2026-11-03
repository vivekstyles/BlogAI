---
title: 10 Real-World IoT Projects Using ESP32 and Sensors
seoTitle: 10 Real-World ESP32 IoT Projects with Sensors
description: 10 real-world ESP32 projects with sensors, from air quality and freezer alarms to mmWave presence and LoRa, with configs, calibration and power budgets.
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
  - esp32
  - sensors
  - projects
  - esphome
  - electronics
tocDepth: 2
---

Most ESP32 tutorials stop when a reading appears in the serial monitor. Real-world IoT projects have to keep working for months: in a damp greenhouse, inside a freezer, on a vibrating motor or at the far end of a field. This guide covers **10 ESP32 projects that solve real problems**, and for each one explains the sensor choice, a working configuration, how to calibrate it and what tends to go wrong once it is installed.

**The short answer.** The ESP32's job in these projects is usually simple: read a good sensor, filter the data, send it reliably and survive power or network problems. The hard parts are **choosing a sensor that measures what you think it measures**, **calibrating it**, **powering it** and **protecting it from the environment**.

**How we wrote this.** Sensor specifications come from manufacturers' datasheets and pages, and configuration syntax from the [ESPHome](https://esphome.io/) and Espressif documentation, checked on 3 November 2026. We did not deploy these projects for this article. Configurations are starting points, so check them against the current ESPHome documentation for your version, since component options change. Battery-life figures in this guide are worked examples, not measurements.

## Choosing an ESP32 for real projects

Espressif now sells several ESP32 families. They share tools (ESP-IDF, the Arduino core and ESPHome), but differ in radios and processing power.

| Chip | Wireless | Good for |
|---|---|---|
| ESP32 (original) | Wi-Fi 4, Bluetooth Classic and LE | General projects; huge amount of example code |
| ESP32-S3 | Wi-Fi 4, Bluetooth LE | Cameras, audio, on-device machine learning, native USB |
| ESP32-C3 | Wi-Fi 4, Bluetooth LE | Low-cost sensors |
| ESP32-C6 | Wi-Fi 6, Bluetooth LE, 802.15.4 (Thread, Zigbee) | Matter and Thread devices |
| ESP32-H2 | Bluetooth LE, 802.15.4 (no Wi-Fi) | Low-power Thread or Zigbee devices |
| ESP32-C5 | Dual-band (2.4 and 5 GHz) Wi-Fi 6, Bluetooth LE, 802.15.4 | Crowded Wi-Fi environments, Matter |
| ESP32-P4 | No built-in radio; usually paired with a C6 or C5 | Displays, cameras, heavy processing |

Sources: Espressif product pages for the [ESP32-C6](https://www.espressif.com/en/products/socs/esp32-c6), [ESP32-C5](https://www.espressif.com/en/products/socs/esp32-c5) and [ESP32-P4](https://www.espressif.com/en/products/socs/esp32-p4).

**The board matters as much as the chip.** For battery projects, choose a board with a low-quiescent-current regulator and no always-on USB-serial chip or power LED. Espressif's datasheet gives the bare chip a deep-sleep current measured in microamps ([ESP32 datasheet](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)), but a typical development board can draw milliamps while "asleep".

**Why ESPHome for most of these.** [ESPHome](https://esphome.io/) builds firmware from a YAML description and handles Wi-Fi reconnection, over-the-air updates, encrypted communication with Home Assistant, filters and many sensor drivers. For projects 5 and 8, which need custom signal processing or radio stacks, use the Arduino core or ESP-IDF instead.

Every ESPHome example below assumes this common header, with secrets in `secrets.yaml`:

```yaml
esphome:
  name: device-name

esp32:
  board: esp32dev
  framework:
    type: esp-idf

logger:
api:
  encryption:
    key: !secret api_key
ota:
  - platform: esphome
    password: !secret ota_password
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
```

## 1. Indoor air quality station (CO₂ and particulates)

**Problem:** classrooms, offices and bedrooms often get stuffy without anyone noticing. CO₂ levels are a practical proxy for how well a room is ventilated, and fine particles (PM2.5) come from cooking, candles, traffic and smoke.

**Sensors:**
- **Sensirion SCD40/SCD41** for CO₂, temperature and humidity. It is an NDIR (non-dispersive infrared) sensor, so it measures CO₂ directly ([Sensirion](https://sensirion.com/products/catalog/SCD41)).
- **Plantower PMS5003** or **Sensirion SPS30** laser particle counters for PM1, PM2.5 and PM10.
- Avoid MQ-135 "air quality" modules for this job: they respond to many gases, drift, and do not measure CO₂.

**Configuration (add to the common header):**

```yaml
i2c:
  sda: GPIO21
  scl: GPIO22

uart:
  rx_pin: GPIO16
  tx_pin: GPIO17
  baud_rate: 9600

sensor:
  - platform: scd4x
    co2:
      name: "CO2"
    temperature:
      name: "Temperature"
    humidity:
      name: "Humidity"
    update_interval: 60s

  - platform: pmsx003
    type: PMSX003
    pm_2_5:
      name: "PM2.5"
    pm_10_0:
      name: "PM10"
    update_interval: 120s
```

**Calibration and placement:** the SCD4x uses automatic self-calibration by default, which assumes the sensor sees fresh-air levels regularly; in a room that is never well ventilated, read Sensirion's notes on forced recalibration instead. Mount the station at breathing height, away from windows, doors and people's faces. The ESP32 warms its surroundings, so keep the temperature sensor away from the board.
**Real-world issues:** particle sensors have fans that collect dust and wear out; running them every two minutes instead of continuously extends their life. Laser particle counters can over-read in very humid air.
**Make it useful:** a three-colour LED or small display in the room changes behaviour more than a dashboard nobody opens.

## 2. Fridge and freezer temperature alarm

**Problem:** a freezer door left ajar or a failed compressor can ruin food, vaccines or lab samples, and nobody notices until it is too late.

**Sensors:** **DS18B20** waterproof probes on the 1-Wire bus. The thin cable fits through a door seal, and several probes can share one data pin.
**Targets:** U.S. federal food safety guidance is to keep refrigerators at or below 40 °F (4 °C) and freezers at 0 °F (−18 °C) or below ([FoodSafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)).

**Configuration:**

```yaml
one_wire:
  - platform: gpio
    pin: GPIO4            # with a 4.7 kΩ pull-up resistor to 3.3 V

sensor:
  - platform: dallas_temp
    address: 0x1c0000031edd2a28   # find yours in the device log
    name: "Freezer temperature"
    update_interval: 30s
    filters:
      - sliding_window_moving_average:
          window_size: 4
          send_every: 2
```

**Alerting:** in Home Assistant, alert when the freezer is above −15 °C **for 20 minutes** (so defrost cycles and a quick door opening do not trigger alarms), and also alert when the sensor becomes **unavailable**. The second rule matters: a power cut that kills the freezer also kills the ESP32, and silence is not the same as "all OK".
**Real-world issues:** put the probe in a small bottle of glycol or water to measure product temperature rather than air spikes when the door opens. For critical uses such as vaccines, use a certified data logger; a DIY alarm is a useful extra layer, not a replacement.
**Stretch goal:** add a local buzzer and a battery-backed supply so the device can sound an alarm even when Wi-Fi is down.

## 3. Greenhouse soil moisture and irrigation controller

**Problem:** over- and under-watering are both common, and conditions differ between beds.

**Sensors and actuators:** one **capacitive** soil moisture sensor per bed, a BME280 for air temperature and humidity, and a **12 V DC or 24 V AC solenoid valve** per zone, switched by a relay or MOSFET module.
**Why capacitive:** resistive probes pass current through exposed metal and corrode in damp, fertilised soil ([freeCodeCamp](https://www.freecodecamp.org/news/how-to-use-a-resistive-soil-moisture-sensor/)).

**Configuration:**

```yaml
sensor:
  - platform: adc
    pin: GPIO34                 # ADC1 pin: works while Wi-Fi is on
    name: "Bed 1 soil moisture"
    attenuation: 12db
    update_interval: 60s
    unit_of_measurement: "%"
    filters:
      - median:
          window_size: 5
      - calibrate_linear:       # measured volts -> percent; replace with your own readings
          - 2.60 -> 0.0
          - 1.10 -> 100.0
      - clamp:
          min_value: 0
          max_value: 100

switch:
  - platform: gpio
    pin: GPIO26
    id: bed1_valve
    name: "Bed 1 valve"
    restore_mode: ALWAYS_OFF    # after a reboot, the valve stays closed
    on_turn_on:
      - delay: 10min            # hard safety limit, whatever the automation does
      - switch.turn_off: bed1_valve
```

**Calibration:** record the voltage with the probe in dry soil from that bed and in the same soil after a thorough watering, and use those two points. Soil type changes the readings a lot, so calibrate per bed.
**Real-world issues:** ADC1 vs ADC2 matters on the original ESP32: ADC2 is shared with the Wi-Fi radio ([Espressif](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/adc/adc_oneshot.html)). Seal the top of each capacitive probe (the electronics are not waterproof) and use normally-closed valves so a power cut does not flood the greenhouse.

## 4. Water tank level monitor

**Problem:** rainwater tanks, overhead tanks and livestock troughs run dry or overflow when nobody checks them.

**Sensor options:**
- **Waterproof ultrasonic** (JSN-SR04T or similar): mounted on top, no contact with water. Struggles with narrow tanks, condensation on the transducer and foam.
- **Time-of-flight laser** (VL53L1X): short range, good for small tanks.
- **Submersible pressure transducer** (4–20 mA or 0.5–4.5 V): sits on the bottom and measures water depth by pressure. The most reliable for real tanks, but it needs an analog front end and the cable must vent to air.

**Measurement tips:** take five readings and use the median; convert distance to volume with the tank's real shape (cylinders on their side are not linear); and correct ultrasonic readings for temperature, since the speed of sound changes by roughly 0.6 m/s per °C.
**Power:** a tank level changes slowly. One reading every 15 minutes with deep sleep in between makes a small solar panel and battery enough (see the power budget below).
**Real-world issues:** 5 V ultrasonic modules need a level shifter on the echo line, enclosures on tank lids get hot in the sun, and spiders love ultrasonic transducers.

## 5. Machine vibration monitoring

**Problem:** motors, pumps and fans often start vibrating differently long before they fail. Listening for that change is the idea behind **condition monitoring** and predictive maintenance.

**Sensor:** a digital accelerometer such as the **ADXL345** (up to 3,200 samples per second over SPI, per Analog Devices' datasheet) or a higher-grade MEMS vibration sensor, bolted or glued firmly to the machine housing. A loose mount measures the mount, not the machine.

**Approach (Arduino core or ESP-IDF, not ESPHome):**
1. Sample one axis at a fixed rate, for example 1,600 Hz, into a buffer of 1,024 samples.
2. Compute simple features on the device: **RMS** (overall vibration energy), **peak** and **crest factor** (peak divided by RMS, which rises with impacts from a damaged bearing).
3. Run an **FFT** (for example with the ArduinoFFT library) and report the energy in a few frequency bands around the motor's running speed and its multiples.
4. Send only these features every minute over MQTT, not raw data.

```cpp
// Feature extraction from a buffer of accelerations (in g)
float rms = 0, peak = 0;
for (int i = 0; i < N; i++) {
  rms += samples[i] * samples[i];
  peak = max(peak, fabsf(samples[i]));
}
rms = sqrtf(rms / N);
float crest = rms > 0 ? peak / rms : 0;
```

**Learning from data:** record a baseline when the machine is known to be healthy, then alert on changes relative to that baseline. For practice with labelled faults, the [Case Western Reserve University Bearing Data Center](https://engineering.case.edu/bearingdatacenter) publishes bearing vibration data used in many research papers. A small anomaly-detection model can run on an ESP32-S3; our [machine learning projects](/articles/machine-learning-projects) guide covers the modelling side.
**Real-world issues:** the sampling rate must be more than twice the highest frequency you care about (the Nyquist rule), and electrical noise from motor drives can couple into long sensor cables.

## 6. Appliance and circuit energy monitor

**Problem:** you cannot reduce what you cannot see. Knowing which appliances use the most electricity, and when, is the first step to cutting bills.

**Sensors:**
- **Split-core current transformers (CTs)** such as the SCT-013 clip around **one** conductor of a cable and output a small signal proportional to current. They are non-invasive, but installing them inside a distribution board is work for a qualified electrician.
- **Energy metering chips** such as the ATM90E32, used by several open-hardware ESP32 energy monitors, measure voltage too, so they calculate real power and power factor.
- **Smart plugs with metering**, often running ESPHome or Tasmota, need no wiring at all.

**Configuration (CT on an ADC1 pin, with a burden resistor and bias circuit):**

```yaml
sensor:
  - platform: adc
    pin: GPIO35
    id: ct_adc
    attenuation: 12db

  - platform: ct_clamp
    sensor: ct_adc
    name: "Washing machine current"
    update_interval: 60s
    filters:
      - calibrate_linear:       # measured ADC amplitude -> amps, from a plug-in meter
          - 0 -> 0
          - 0.5 -> 15.0
```

**An important limitation:** a CT alone measures **current**. Multiplying by a nominal voltage gives *apparent* power, which overestimates the real power of motors and electronics with a poor power factor. For accurate kWh, measure voltage too.
**Safety:** never open a socket, plug or consumer unit to fit a sensor unless you are qualified. Plug-in meters and smart plugs are the safe option for students.

## 7. Room presence with mmWave radar

**Problem:** PIR motion sensors only see movement, so lights turn off on someone reading or working at a desk.

**Sensor:** a 24 GHz **mmWave radar** module such as the Hi-Link **LD2410** detects tiny movements, including breathing, and reports "moving" and "still" targets with distance. ESPHome has a dedicated component ([ESPHome LD2410](https://esphome.io/components/sensor/ld2410.html)).

**Configuration:**

```yaml
uart:
  tx_pin: GPIO17
  rx_pin: GPIO16
  baud_rate: 256000
  parity: NONE
  stop_bits: 1

ld2410:

binary_sensor:
  - platform: ld2410
    has_target:
      name: "Presence"
    has_moving_target:
      name: "Moving target"
    has_still_target:
      name: "Still target"
```

**Tuning:** set the maximum detection distance and per-gate sensitivity so the sensor does not see through thin walls or react to a fan or curtain. Combining radar with a PIR sensor gives fast "someone came in" and reliable "someone is still here".
**Privacy:** radar does not capture images, which makes it more acceptable than cameras in bedrooms and bathrooms, but tell people it is there.

## 8. Long-range LoRaWAN sensor for remote sites

**Problem:** fields, rivers, gates and remote tanks are far from Wi-Fi and often have no mobile signal worth paying for.

**Hardware:** an ESP32 board with a **LoRa** radio (for example an SX1262), running a LoRaWAN stack such as RadioLib or LMIC, plus whatever sensor the site needs: soil moisture, water level or a gate reed switch.
**Network:** your own gateway or a community network such as **The Things Network (TTN)**.
**Design rules:** LoRaWAN is for **small, infrequent** messages. Many regions limit radio duty cycle by law, and TTN's fair-use policy limits each device to about 30 seconds of uplink airtime per day ([The Things Network](https://www.thethingsnetwork.org/docs/lorawan/duty-cycle/)). Encode readings as a few bytes (for example, temperature × 100 as a 16-bit integer) rather than JSON text, and send every 10 to 30 minutes.
**Real-world issues:** antenna choice and height matter far more than transmit power; a gateway on a roof can reach kilometres in open country but much less in a city. Battery life depends mostly on how long the radio transmits.

## 9. Bluetooth proxy and sensor gateway

**Problem:** cheap Bluetooth thermometers, plant sensors and locks only reach a few metres, and your home automation hub might be at the other end of the house.

**Solution:** an ESP32 running ESPHome's **Bluetooth proxy** listens for Bluetooth LE advertisements and forwards them to Home Assistant over Wi-Fi, extending Bluetooth range room by room ([ESPHome Bluetooth Proxy](https://esphome.io/components/bluetooth_proxy.html)).

```yaml
esp32_ble_tracker:
  scan_parameters:
    active: true

bluetooth_proxy:
  active: true
```

**Why it is useful:** Home Assistant automatically uses whichever proxy hears a device best. Sensors that use the open **BTHome** format work without vendor apps or cloud accounts ([BTHome](https://bthome.io/)).
**Real-world issues:** use Ethernet-connected ESP32 boards where possible, because Wi-Fi and Bluetooth share one radio and an ESP32 doing both can drop packets in busy areas.

## 10. Solar-powered outdoor weather station

**Problem:** a backyard, school or farm weather station needs to run outdoors without mains power and produce readings people can trust.

**Sensors:** BME280 for temperature, humidity and pressure; a **tipping-bucket rain gauge** (a reed switch that closes once per fixed amount of rain); a cup **anemometer** (pulses per rotation); a light sensor.
**Placement:** the World Meteorological Organization's guidance is to measure air temperature in a ventilated shelter, shaded from direct sun, about 1.25 to 2 m above the ground ([WMO-No. 8](https://library.wmo.int/idurl/4/68695)). A sensor in a sealed box in sunshine can read many degrees too high.
**Counting pulses with deep sleep:** the rain gauge and anemometer produce pulses at any time. A normal deep-sleep design misses them, so either keep the ESP32 awake (and size the solar panel accordingly), use the ESP32's ultra-low-power coprocessor to count pulses, or use a small external counter.
**ESPHome pieces:** `pulse_counter` for the anemometer and rain gauge, and the `deep_sleep` component if you choose a sleep-based design.

## Power budget: a worked example

For a battery sensor that wakes up, measures, sends and sleeps, the **average current** is what drains the battery:

*average current = (active current × active time + sleep current × sleep time) ÷ cycle time*

Example: a node wakes every 10 minutes (600 s), is active for 5 s at an assumed 120 mA while Wi-Fi connects and sends, and sleeps for 595 s at an assumed 0.15 mA (a well-designed low-power board, not a typical dev board):

- Active: 120 mA × 5 s = 600 mA·s
- Sleep: 0.15 mA × 595 s = 89.25 mA·s
- Average: 689.25 ÷ 600 ≈ **1.15 mA**

A 2,000 mAh battery would last about 2,000 ÷ 1.15 ≈ 1,740 hours, or **roughly 72 days**, before allowing for cold weather, battery ageing and self-discharge. Two lessons follow. First, the **active phase dominates**: halving the Wi-Fi connection time (static IP, fixed channel, fewer retries) helps more than shaving the sleep current further. Second, a dev board drawing 10 mA while "asleep" would last less than ten days on the same battery. **Measure your own currents** with a multimeter or a current-profiling tool before trusting any estimate.

## Deployment checklist

- **Enclosure:** choose an IP rating suitable for the site, use cable glands, add a vent or desiccant to manage condensation, and keep electronics out of direct sun.
- **Sensor exposure:** the sensor must see the environment, not the inside of a sealed box.
- **Power:** add margin to your power budget, and plan for winter sun on solar builds.
- **Recovery:** enable the watchdog, reconnect Wi-Fi automatically, and give every device OTA updates.
- **Data quality:** reject impossible values, flag stuck readings, and alert when a device goes silent.
- **Calibration:** record how and when each sensor was calibrated, and recheck periodically, since low-cost sensors drift.
- **Security:** encrypted API keys, unique passwords, no secrets in Git, and OTA passwords ([ETSI EN 303 645](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf) lists the baseline expectations for consumer IoT).
- **Documentation:** a photo of the wiring, the pin map and the calibration values, stored with the code.

## Related reading

- New to ESP32? Start with our [25 IoT projects for beginners](/articles/iot-projects-for-beginners).
- For complete Arduino sketches (web servers, MQTT, ESP-NOW, OTA), see our [15 Arduino IoT projects with source code](/articles/arduino-iot-projects).
- To run Home Assistant, MQTT and dashboards for these sensors, see our [20 Raspberry Pi smart home projects](/articles/raspberry-pi-smart-home-projects).
- Several of these make strong capstones; see our [30 IoT project ideas for engineering students](/articles/iot-project-ideas-for-final-year-students).

## References

1. Espressif Systems. "ESP32-C6." [espressif.com](https://www.espressif.com/en/products/socs/esp32-c6)
2. Espressif Systems. "ESP32-C5." [espressif.com](https://www.espressif.com/en/products/socs/esp32-c5)
3. Espressif Systems. "ESP32-P4." [espressif.com](https://www.espressif.com/en/products/socs/esp32-p4)
4. Espressif Systems. *ESP32 Series Datasheet*. [espressif.com](https://www.espressif.com/sites/default/files/documentation/esp32_datasheet_en.pdf)
5. Espressif Systems. "ADC Oneshot Mode Driver." *ESP-IDF Programming Guide*. [docs.espressif.com](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/api-reference/peripherals/adc/adc_oneshot.html)
6. ESPHome. *ESPHome documentation*. [esphome.io](https://esphome.io/)
7. ESPHome. "LD2410 Sensor." [esphome.io](https://esphome.io/components/sensor/ld2410.html)
8. ESPHome. "Bluetooth Proxy." [esphome.io](https://esphome.io/components/bluetooth_proxy.html)
9. Sensirion. "SCD41." [sensirion.com](https://sensirion.com/products/catalog/SCD41)
10. FoodSafety.gov (U.S. Department of Health and Human Services). "Cold Food Storage Chart." [foodsafety.gov](https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts)
11. Case Western Reserve University. "Bearing Data Center." [engineering.case.edu](https://engineering.case.edu/bearingdatacenter)
12. The Things Network. "Duty cycle." [thethingsnetwork.org](https://www.thethingsnetwork.org/docs/lorawan/duty-cycle/)
13. BTHome. [bthome.io](https://bthome.io/)
14. World Meteorological Organization. *Guide to Instruments and Methods of Observation* (WMO-No. 8). [library.wmo.int](https://library.wmo.int/idurl/4/68695)
15. freeCodeCamp. "How to Use a Resistive Soil Moisture Sensor." [freecodecamp.org](https://www.freecodecamp.org/news/how-to-use-a-resistive-soil-moisture-sensor/)
16. ETSI. *EN 303 645: Cyber Security for Consumer Internet of Things: Baseline Requirements*. [etsi.org](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/03.01.03_60/en_303645v030103p.pdf)
