---
title: 100 Best Physics Formulas Every Student Should Know
seoTitle: 100 Physics Formulas Every Student Should Know
description: The 100 physics formulas students use most, from kinematics and energy to circuits, optics and modern physics, each with symbols, units and a worked example.
author: BlogAI Editors
authorType: Organization
publishedAt: 2026-10-17
updatedAt: 2026-10-17
status: published
categories:
  - Physics
  - Mathematics
tags:
  - physics
  - physics formulas
  - formula sheet
  - mechanics
  - electricity
  - exam revision
tocDepth: 2
---

This is a working reference for the physics formulas that appear again and again in high school and first-year university courses: motion, forces, energy, rotation, gravity, fluids, waves, heat, electricity, magnetism, optics and modern physics.

Each of the 100 entries gives the formula, what every symbol means with its SI unit, when to use it, and a short worked example. Use it as a revision checklist. If you cannot say when a formula applies, or you cannot redo its example without looking, that is the one to practise.

**How this was checked.** Formulas follow the free OpenStax textbooks *University Physics* (Volumes 1–3) and *College Physics 2e*. Constants are the 2022 CODATA values published by NIST. Every worked example was recomputed in Python, and results are rounded to a sensible number of significant figures. Examples use $g = 9.8\ \text{m/s}^2$ unless stated otherwise. Full references are [at the end](#references).

## Constants used in this article

| Constant | Symbol | Value |
|---|---|---|
| Speed of light in vacuum | $c$ | $2.998 \times 10^8$ m/s (exact: 299,792,458 m/s) |
| Gravitational constant | $G$ | $6.674 \times 10^{-11}$ N·m²/kg² |
| Planck constant | $h$ | $6.626 \times 10^{-34}$ J·s (exact) |
| Elementary charge | $e$ | $1.602 \times 10^{-19}$ C (exact) |
| Electron mass | $m_e$ | $9.109 \times 10^{-31}$ kg |
| Boltzmann constant | $k_B$ | $1.381 \times 10^{-23}$ J/K (exact) |
| Molar gas constant | $R$ | $8.314$ J/(mol·K) |
| Avogadro constant | $N_A$ | $6.022 \times 10^{23}$ mol⁻¹ (exact) |
| Stefan–Boltzmann constant | $\sigma$ | $5.670 \times 10^{-8}$ W/(m²·K⁴) |
| Vacuum permittivity | $\varepsilon_0$ | $8.854 \times 10^{-12}$ F/m |
| Vacuum permeability | $\mu_0$ | $1.257 \times 10^{-6}$ N/A² |
| Coulomb constant | $k = 1/(4\pi\varepsilon_0)$ | $8.988 \times 10^9$ N·m²/C² |
| Standard gravity | $g$ | $9.80665$ m/s² (exact, by definition); about 9.8 m/s² in examples |

Values from the [NIST CODATA 2022 tables](https://physics.nist.gov/cuu/Constants/). "Exact" means the value is fixed by the definition of the SI units since 2019.

## Kinematics

The equations of motion for constant acceleration, plus projectiles ([OpenStax University Physics Volume 1, chapters 3–4](https://openstax.org/details/books/university-physics-volume-1)). In formulas 3 to 6, $u$ is the initial velocity, $v$ the final velocity, $a$ the acceleration, $t$ the time and $s$ the displacement.

### 1. Average speed and velocity

$$
\bar{v} = \frac{\Delta x}{\Delta t}
$$

**Symbols:** $\Delta x$ is displacement (m) for velocity, or total distance for speed; $\Delta t$ is time taken (s).

**Use it when:** you need an average over a whole trip, not the value at one instant.

**Example:** A drive of 120 km in 1.5 h has an average speed of 80 km/h, or $80 / 3.6 = 22.2$ m/s.

### 2. Acceleration

$$
a = \frac{\Delta v}{\Delta t}
$$

**Symbols:** $\Delta v$ is change in velocity (m/s), $\Delta t$ is time (s), $a$ is in m/s².

**Use it when:** velocity changes at a steady rate, or you want the average acceleration.

**Example:** A car going from rest to 27 m/s in 9.0 s has $a = 27 / 9.0 = 3.0$ m/s².

### 3. Velocity–time equation

$$
v = u + at
$$

**Use it when:** acceleration is constant and you know (or want) the time, but not the displacement.

**Example:** A ball rolling at 5 m/s that accelerates at 2 m/s² for 4 s reaches $v = 5 + 2 \times 4 = 13$ m/s.

### 4. Displacement–time equation

$$
s = ut + \tfrac{1}{2}at^2
$$

**Use it when:** you know the starting velocity, the acceleration and the time, and want the displacement.

**Example:** A stone dropped from rest falls $s = \tfrac{1}{2}(9.8)(3^2) = 44.1$ m in 3 s.

### 5. Velocity–displacement equation

$$
v^2 = u^2 + 2as
$$

**Use it when:** time is unknown and not needed, such as braking-distance problems.

**Example:** A car at 25 m/s braking at 5 m/s² stops when $0 = 25^2 - 2(5)s$, so $s = 62.5$ m.

### 6. Displacement from average velocity

$$
s = \frac{(u + v)}{2}\,t
$$

**Use it when:** acceleration is constant and you know both velocities and the time, but not the acceleration.

**Example:** A train speeding up from 10 m/s to 30 m/s in 20 s travels $s = \frac{10 + 30}{2} \times 20 = 400$ m.

### 7. Range of a projectile

$$
R = \frac{v_0^2 \sin 2\theta}{g}
$$

**Symbols:** $v_0$ is launch speed (m/s), $\theta$ is launch angle above horizontal, $R$ is horizontal range (m).

**Use it when:** the projectile lands at the same height it was launched from and air resistance is negligible. Range is greatest at 45°.

**Example:** At 20 m/s and 45°, $R = 20^2 \times \sin 90° / 9.8 = 40.8$ m.

### 8. Time of flight

$$
T = \frac{2 v_0 \sin\theta}{g}
$$

**Use it when:** the projectile lands at its launch height.

**Example:** At 20 m/s and 30°, $T = 2 \times 20 \times 0.5 / 9.8 = 2.04$ s.

### 9. Maximum height of a projectile

$$
H = \frac{v_0^2 \sin^2\theta}{2g}
$$

**Use it when:** you need the peak height, where the vertical velocity is zero.

**Example:** At 20 m/s and 30°, $H = 400 \times 0.25 / 19.6 = 5.10$ m.

## Forces and momentum

Newton's laws and the forces they act through ([OpenStax University Physics Volume 1, chapters 5, 6 and 9](https://openstax.org/details/books/university-physics-volume-1)).

### 10. Newton's second law

$$
F_{\text{net}} = ma
$$

**Symbols:** $F_{\text{net}}$ is net force (N), $m$ is mass (kg), $a$ is acceleration (m/s²). 1 N = 1 kg·m/s².

**Use it when:** relating the total force on an object to its acceleration. Always use the *net* force.

**Example:** A 1,200 kg car accelerating at 2.5 m/s² needs a net force of $1200 \times 2.5 = 3000$ N.

### 11. Weight

$$
W = mg
$$

**Use it when:** finding the gravitational force on a mass. Mass stays the same everywhere; weight depends on $g$.

**Example:** A 60 kg person weighs $60 \times 9.8 = 588$ N on Earth and $60 \times 1.62 = 97.2$ N on the Moon.

### 12. Friction

$$
f_s \le \mu_s N, \qquad f_k = \mu_k N
$$

**Symbols:** $\mu_s$ and $\mu_k$ are the coefficients of static and kinetic friction (no units), $N$ is the normal force (N).

**Use it when:** surfaces are sliding ($f_k$) or about to slide (maximum $f_s$).

**Example:** Sliding a 50 kg box across a level floor with $\mu_k = 0.30$ needs a force of $0.30 \times 50 \times 9.8 = 147$ N to keep it moving at constant speed.

### 13. Hooke's law

$$
F = -kx
$$

**Symbols:** $k$ is the spring constant (N/m), $x$ is extension or compression from the natural length (m). The minus sign means the force opposes the displacement.

**Use it when:** a spring or elastic material is within its elastic limit.

**Example:** Stretching a spring with $k = 200$ N/m by 5.0 cm needs $200 \times 0.050 = 10$ N.

### 14. Centripetal force

$$
F_c = \frac{mv^2}{r}, \qquad a_c = \frac{v^2}{r}
$$

**Use it when:** something moves in a circle. $F_c$ is not a new force; it is the net inward force supplied by tension, friction, gravity or a normal force.

**Example:** A 1,000 kg car taking a 50 m radius curve at 15 m/s needs $1000 \times 15^2 / 50 = 4500$ N of friction from the road.

### 15. Forces on an inclined plane

$$
F_{\parallel} = mg\sin\theta, \qquad N = mg\cos\theta
$$

**Use it when:** an object rests or slides on a slope at angle $\theta$, with no other forces perpendicular to the slope.

**Example:** For a 10 kg crate on a 30° slope, the force down the slope is $98 \sin 30° = 49$ N and the normal force is $98\cos 30° = 84.9$ N.

### 16. Pressure

$$
P = \frac{F}{A}
$$

**Symbols:** $P$ in pascals (1 Pa = 1 N/m²), $F$ is force perpendicular to the surface (N), $A$ is area (m²).

**Use it when:** a force is spread over an area.

**Example:** A 600 N person standing on 0.040 m² of shoe sole exerts $15,000$ Pa. Balanced on a 1 cm² heel ($10^{-4}$ m²), the pressure would be $6.0 \times 10^6$ Pa.

### 17. Momentum

$$
p = mv
$$

**Use it when:** analysing collisions, explosions and stopping forces. Momentum is a vector, in kg·m/s.

**Example:** A 0.145 kg baseball at 40 m/s has $p = 5.8$ kg·m/s.

### 18. Impulse–momentum theorem

$$
J = F\,\Delta t = \Delta p
$$

**Use it when:** a force acts for a short time. Stretching the time reduces the average force for the same change in momentum.

**Example:** Catching that 5.8 kg·m/s baseball over 0.05 s takes an average force of $5.8 / 0.05 = 116$ N. Stopping it in 0.005 s would take 1,160 N, which is why you pull your hands back when catching.

### 19. Conservation of momentum

$$
m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2
$$

**Use it when:** no net external force acts during a collision or explosion. It applies to elastic and inelastic collisions.

**Example:** A 1,000 kg car at 20 m/s hits a stationary 1,500 kg car and they lock together: $v = \frac{1000 \times 20}{2500} = 8.0$ m/s.

## Work, energy and power

Energy accounting is often the fastest route to a mechanics answer ([OpenStax University Physics Volume 1, chapters 7–8](https://openstax.org/details/books/university-physics-volume-1)).

### 20. Work done by a constant force

$$
W = Fd\cos\theta
$$

**Symbols:** $F$ is force (N), $d$ is displacement (m), $\theta$ is the angle between them. Work is in joules (J).

**Use it when:** a constant force moves an object. A force perpendicular to the motion does no work.

**Example:** Pulling a suitcase 20 m with 50 N at 30° above the horizontal does $50 \times 20 \times \cos 30° = 866$ J of work.

### 21. Kinetic energy

$$
KE = \tfrac{1}{2}mv^2
$$

**Use it when:** finding the energy of motion. Doubling the speed quadruples the kinetic energy.

**Example:** A 1,000 kg car at 20 m/s has $\tfrac{1}{2}(1000)(20^2) = 200{,}000$ J, or 200 kJ.

### 22. Gravitational potential energy (near Earth)

$$
PE = mgh
$$

**Use it when:** height changes are small compared with Earth's radius. For orbits, use formula 41.

**Example:** A 70 kg person climbing 3.0 m of stairs gains $70 \times 9.8 \times 3.0 = 2058$ J, about 2.1 kJ.

### 23. Elastic potential energy

$$
PE_{\text{spring}} = \tfrac{1}{2}kx^2
$$

**Use it when:** energy is stored in a stretched or compressed spring.

**Example:** A spring with $k = 400$ N/m compressed by 0.10 m stores $\tfrac{1}{2}(400)(0.10^2) = 2.0$ J.

### 24. Work–energy theorem

$$
W_{\text{net}} = \Delta KE = \tfrac{1}{2}mv^2 - \tfrac{1}{2}mu^2
$$

**Use it when:** you know the net work and want a speed, or the other way round, without needing time.

**Example:** Slowing a 1,000 kg car from 20 m/s to 10 m/s takes $W = 50{,}000 - 200{,}000 = -150{,}000$ J. The negative sign means the brakes remove energy.

### 25. Power

$$
P = \frac{W}{t} = \frac{\Delta E}{t}
$$

**Use it when:** you need the rate of energy transfer. Power is in watts (1 W = 1 J/s).

**Example:** Climbing those 3.0 m of stairs (2,058 J) in 4.0 s takes $2058 / 4.0 = 515$ W.

### 26. Power from force and velocity

$$
P = Fv
$$

**Use it when:** a steady force keeps an object moving at constant speed.

**Example:** A cyclist pushing against 20 N of drag at 10 m/s produces $20 \times 10 = 200$ W.

### 27. Efficiency

$$
\eta = \frac{\text{useful energy (or power) out}}{\text{total energy (or power) in}} \times 100\%
$$

**Use it when:** comparing machines. Efficiency is always less than 100% for real devices.

**Example:** A motor taking 400 W of electrical power and delivering 300 W of mechanical power is 75% efficient.

## Rotation

Each linear formula has a rotational partner: mass becomes moment of inertia, force becomes torque ([OpenStax University Physics Volume 1, chapters 10–12](https://openstax.org/details/books/university-physics-volume-1)). Angles must be in radians.

### 28. Angular velocity and linear speed

$$
\omega = \frac{\Delta\theta}{\Delta t}, \qquad v = \omega r
$$

**Symbols:** $\omega$ in rad/s, $r$ is radius (m), $v$ is the speed of a point at radius $r$ (m/s).

**Use it when:** converting between spinning rate and the speed of a point on the rotating object. One revolution is $2\pi$ rad.

**Example:** A wheel turning at 600 revolutions per minute has $\omega = 600 \times 2\pi / 60 = 62.8$ rad/s. A point on its 0.35 m rim moves at $62.8 \times 0.35 = 22.0$ m/s.

### 29. Angular acceleration

$$
\alpha = \frac{\Delta\omega}{\Delta t}, \qquad a_t = \alpha r
$$

**Use it when:** a spin rate changes. $a_t$ is the tangential acceleration of a point at radius $r$.

**Example:** A fan reaching 62.8 rad/s from rest in 4.0 s has $\alpha = 15.7$ rad/s². A point 0.30 m from the axis has $a_t = 4.71$ m/s².

### 30. Torque

$$
\tau = rF\sin\theta
$$

**Symbols:** $r$ is distance from the pivot to where the force acts (m), $\theta$ is the angle between $r$ and $F$. Torque is in N·m.

**Use it when:** working out the turning effect of a force.

**Example:** A 40 N push at right angles on a spanner 0.25 m long gives $\tau = 0.25 \times 40 = 10$ N·m.

### 31. Newton's second law for rotation

$$
\tau_{\text{net}} = I\alpha
$$

**Use it when:** relating net torque to angular acceleration about a fixed axis.

**Example:** A net torque of 10 N·m on a wheel with $I = 0.50$ kg·m² gives $\alpha = 20$ rad/s².

### 32. Moment of inertia

$$
I = \sum m_i r_i^2, \qquad I_{\text{solid disc}} = \tfrac{1}{2}MR^2, \qquad I_{\text{hoop}} = MR^2
$$

**Use it when:** finding how hard an object is to spin. Other common shapes: solid sphere $\tfrac{2}{5}MR^2$, rod about its centre $\tfrac{1}{12}ML^2$.

**Example:** A 2.0 kg solid disc of radius 0.20 m has $I = \tfrac{1}{2}(2.0)(0.20^2) = 0.040$ kg·m².

### 33. Rotational kinetic energy

$$
KE_{\text{rot}} = \tfrac{1}{2}I\omega^2
$$

**Use it when:** an object spins. A rolling object has both $\tfrac{1}{2}mv^2$ and $\tfrac{1}{2}I\omega^2$.

**Example:** The 0.040 kg·m² disc spinning at 50 rad/s stores $\tfrac{1}{2}(0.040)(50^2) = 50$ J.

### 34. Angular momentum and its conservation

$$
L = I\omega, \qquad I_1\omega_1 = I_2\omega_2
$$

**Use it when:** no external torque acts, so $L$ stays constant.

**Example:** A skater spinning at 2.0 rad/s with $I = 3.0$ kg·m² pulls in their arms to $I = 1.0$ kg·m² and spins at $\omega_2 = 3.0 \times 2.0 / 1.0 = 6.0$ rad/s.

### 35. Conditions for equilibrium

$$
\sum F = 0, \qquad \sum \tau = 0
$$

**Use it when:** an object is at rest and not rotating, such as beams, ladders, shelves and seesaws.

**Example:** A 30 kg child sits 2.0 m from a seesaw's pivot. A 40 kg child balances them at $x = 30 \times 2.0 / 40 = 1.5$ m on the other side.

## Gravitation and orbits

Newton's law of gravitation and the motion of satellites ([OpenStax University Physics Volume 1, chapter 13](https://openstax.org/details/books/university-physics-volume-1)). Examples use Earth's mass $M_E = 5.972 \times 10^{24}$ kg and mean radius $R_E = 6.371 \times 10^6$ m.

### 36. Newton's law of universal gravitation

$$
F = \frac{G m_1 m_2}{r^2}
$$

**Symbols:** $r$ is the distance between the centres of mass (m).

**Use it when:** finding the attraction between any two masses.

**Example:** Earth and the Moon ($7.35 \times 10^{22}$ kg, $3.84 \times 10^8$ m apart) attract each other with about $1.98 \times 10^{20}$ N.

### 37. Gravitational field strength

$$
g = \frac{GM}{R^2}
$$

**Use it when:** finding surface gravity on a planet or $g$ at a height above it (use $r = R + h$).

**Example:** For Earth, $g = 6.674 \times 10^{-11} \times 5.972 \times 10^{24} / (6.371 \times 10^6)^2 = 9.82$ m/s². The measured value varies from about 9.78 to 9.83 m/s² with latitude and altitude.

### 38. Orbital speed (circular orbit)

$$
v = \sqrt{\frac{GM}{r}}
$$

**Use it when:** a satellite is in a circular orbit of radius $r$ measured from the planet's centre.

**Example:** At 400 km altitude, $r = 6.771 \times 10^6$ m and $v = 7.67$ km/s, about the speed of the International Space Station.

### 39. Kepler's third law

$$
T^2 = \frac{4\pi^2}{GM}\,r^3
$$

**Use it when:** relating an orbit's period to its radius (or semi-major axis for an ellipse).

**Example:** For the 400 km orbit above, $T = 2\pi\sqrt{r^3/GM} = 5545$ s, about 92 minutes.

### 40. Escape velocity

$$
v_{\text{esc}} = \sqrt{\frac{2GM}{R}}
$$

**Use it when:** finding the minimum launch speed to leave a planet with no further thrust, ignoring air resistance.

**Example:** For Earth, $v_{\text{esc}} = 11.2$ km/s, exactly $\sqrt{2}$ times the orbital speed at the same radius.

### 41. Gravitational potential energy (general)

$$
U = -\frac{GMm}{r}
$$

**Use it when:** heights are large compared with the planet's radius. $U = 0$ at infinite distance, so bound objects have negative energy.

**Example:** Raising 1 kg from Earth's surface to 400 km takes $GM(1/R_E - 1/r) = 3.70 \times 10^6$ J. The approximation $mgh$ would give $3.93 \times 10^6$ J, about 6% too much, because $g$ falls with height.

## Fluids

Pressure, buoyancy and flow ([OpenStax University Physics Volume 1, chapter 14](https://openstax.org/details/books/university-physics-volume-1)). Fresh water has $\rho \approx 1000$ kg/m³; air at room conditions about 1.2 kg/m³.

### 42. Density

$$
\rho = \frac{m}{V}
$$

**Use it when:** comparing materials or predicting whether something floats.

**Example:** A 500 g stone with a volume of 200 cm³ has $\rho = 2.5$ g/cm³, or 2,500 kg/m³.

### 43. Pressure at depth

$$
P = P_0 + \rho g h
$$

**Symbols:** $P_0$ is pressure at the surface (Pa), $h$ is depth (m).

**Use it when:** finding pressure in a liquid at rest.

**Example:** At 10 m in fresh water, the water adds $1000 \times 9.8 \times 10 = 98$ kPa. With atmospheric pressure (101 kPa), the total is about 199 kPa, roughly double the surface pressure.

### 44. Archimedes' principle

$$
F_b = \rho_{\text{fluid}}\, V_{\text{displaced}}\, g
$$

**Use it when:** finding the upward force on a submerged or floating object. An object floats if it can displace its own weight of fluid.

**Example:** A fully submerged 0.0020 m³ block in water feels a buoyant force of $1000 \times 0.0020 \times 9.8 = 19.6$ N.

### 45. Pascal's principle (hydraulics)

$$
\frac{F_1}{A_1} = \frac{F_2}{A_2}
$$

**Use it when:** a confined fluid transmits pressure between two pistons.

**Example:** 100 N on a 4.0 cm² piston produces $100 \times (400 / 4.0) = 10{,}000$ N on a 400 cm² piston, enough to lift about 1,000 kg.

### 46. Continuity equation

$$
A_1 v_1 = A_2 v_2
$$

**Use it when:** an incompressible fluid flows through a pipe that changes width.

**Example:** Water at 1.0 m/s in a 2.0 cm-diameter hose speeds up to 16 m/s in a 0.50 cm nozzle, because the area is 16 times smaller.

### 47. Bernoulli's equation

$$
P + \tfrac{1}{2}\rho v^2 + \rho g h = \text{constant}
$$

**Use it when:** steady, non-viscous, incompressible flow along a streamline. Faster flow at the same height means lower pressure.

**Example:** Water speeding up from 2.0 m/s to 4.0 m/s in a horizontal pipe drops in pressure by $\tfrac{1}{2}(1000)(4^2 - 2^2) = 6000$ Pa.

### 48. Drag equation

$$
F_D = \tfrac{1}{2}\rho v^2 C_D A
$$

**Symbols:** $C_D$ is the drag coefficient (no units), $A$ is frontal area (m²).

**Use it when:** estimating air or water resistance at everyday speeds, where drag grows with $v^2$.

**Example:** A cyclist with $C_D A = 0.30$ m² at 10 m/s in air of density 1.2 kg/m³ feels $\tfrac{1}{2}(1.2)(10^2)(0.30) = 18$ N of drag and must produce $18 \times 10 = 180$ W just to overcome it.

## Oscillations, waves and sound

Oscillators, wave speed, sound levels and the Doppler effect ([OpenStax University Physics Volume 1, chapters 15–17](https://openstax.org/details/books/university-physics-volume-1)).

### 49. Simple harmonic motion

$$
x(t) = A\cos(\omega t + \phi)
$$

**Symbols:** $A$ is amplitude (m), $\omega$ is angular frequency (rad/s), $\phi$ is the phase constant.

**Use it when:** an object oscillates under a restoring force proportional to displacement.

**Example:** With $A = 0.10$ m, $f = 2.0$ Hz ($\omega = 4\pi$ rad/s) and $\phi = 0$, the position at $t = 0.10$ s is $0.10\cos(0.4\pi) = 0.031$ m.

### 50. Period of a mass on a spring

$$
T = 2\pi\sqrt{\frac{m}{k}}
$$

**Use it when:** a mass oscillates on an ideal spring. The period does not depend on amplitude.

**Example:** A 0.50 kg mass on a 200 N/m spring has $T = 2\pi\sqrt{0.0025} = 0.314$ s.

### 51. Period of a simple pendulum

$$
T = 2\pi\sqrt{\frac{L}{g}}
$$

**Use it when:** a pendulum swings through small angles (below about 15°). The period does not depend on mass.

**Example:** A 1.00 m pendulum with $g = 9.81$ m/s² has $T = 2.01$ s.

### 52. Frequency, period and angular frequency

$$
f = \frac{1}{T}, \qquad \omega = 2\pi f
$$

**Use it when:** converting between how often something repeats and how long each cycle takes. Frequency is in hertz (Hz).

**Example:** A 50 Hz mains supply has a period of 0.020 s and $\omega = 314$ rad/s.

### 53. Wave equation

$$
v = f\lambda
$$

**Use it when:** relating speed, frequency and wavelength for any wave.

**Example:** The note A at 440 Hz in air (343 m/s) has a wavelength of $343 / 440 = 0.780$ m.

### 54. Wave speed on a string

$$
v = \sqrt{\frac{T}{\mu}}
$$

**Symbols:** $T$ is tension (N), $\mu$ is mass per unit length (kg/m).

**Use it when:** tuning string instruments or working with standing waves on strings.

**Example:** A string under 60 N with $\mu = 0.00060$ kg/m carries waves at $v = \sqrt{100{,}000} = 316$ m/s.

### 55. Speed of sound in air

$$
v \approx 331 + 0.6\,T_C \ \text{m/s}
$$

**Symbols:** $T_C$ is air temperature in °C.

**Use it when:** you need the speed of sound at an everyday temperature. It is an approximation valid near room temperature.

**Example:** At 20 °C, $v \approx 343$ m/s; at 30 °C, about 349 m/s.

### 56. Sound intensity level

$$
\beta = 10\log_{10}\!\left(\frac{I}{I_0}\right)\ \text{dB}, \qquad I_0 = 10^{-12}\ \text{W/m}^2
$$

**Use it when:** converting sound intensity (W/m²) to decibels. Every 10 dB increase is a factor of 10 in intensity.

**Example:** $I = 10^{-5}$ W/m² gives $\beta = 10\log_{10}(10^7) = 70$ dB, roughly busy traffic.

### 57. Doppler effect for sound

$$
f' = f\,\frac{v \pm v_o}{v \mp v_s}
$$

**Symbols:** $v$ is the speed of sound, $v_o$ the observer's speed, $v_s$ the source's speed. Use the upper signs when they move towards each other.

**Use it when:** source or listener moves relative to the air.

**Example:** A 700 Hz siren approaching a stationary listener at 30 m/s sounds like $700 \times 343 / 313 = 767$ Hz, and $700 \times 343 / 373 = 644$ Hz as it moves away.

### 58. Standing waves on a string

$$
f_n = \frac{nv}{2L}, \qquad n = 1, 2, 3, \dots
$$

**Use it when:** a string is fixed at both ends. $n = 1$ is the fundamental; the others are harmonics.

**Example:** The 316 m/s string from formula 54, 0.65 m long, has a fundamental of $316 / 1.3 = 243$ Hz and a second harmonic of 486 Hz.

### 59. Beat frequency

$$
f_{\text{beat}} = |f_1 - f_2|
$$

**Use it when:** two close frequencies sound together and the loudness throbs.

**Example:** Tuning forks at 440 Hz and 444 Hz produce 4 beats per second. Musicians tune by adjusting until the beats disappear.

## Heat and thermodynamics

Temperature, heat transfer, gases and engines ([OpenStax University Physics Volume 2, chapters 1–4](https://openstax.org/details/books/university-physics-volume-2)). Gas-law temperatures must be in kelvins.

### 60. Temperature conversions

$$
T_K = T_C + 273.15, \qquad T_F = \tfrac{9}{5}T_C + 32
$$

**Use it when:** switching scales. Gas laws, radiation and engine efficiency always use kelvins.

**Example:** 37 °C is 310.15 K and 98.6 °F.

### 61. Linear thermal expansion

$$
\Delta L = \alpha L_0 \Delta T
$$

**Symbols:** $\alpha$ is the coefficient of linear expansion (1/K), $L_0$ is original length (m).

**Use it when:** sizing gaps in bridges, rails and pipes.

**Example:** A 100 m steel bridge ($\alpha \approx 12 \times 10^{-6}$ /K) warming by 40 K grows by $12 \times 10^{-6} \times 100 \times 40 = 0.048$ m, nearly 5 cm.

### 62. Specific heat

$$
Q = mc\Delta T
$$

**Symbols:** $Q$ is heat (J), $c$ is specific heat capacity (J/(kg·K)); for water $c \approx 4186$ J/(kg·K).

**Use it when:** temperature changes without a change of state.

**Example:** Heating 1.0 kg of water from 20 °C to 100 °C takes $4186 \times 80 = 335$ kJ. A 2.0 kW kettle would need at least 167 s, a bit under 3 minutes, ignoring losses.

### 63. Latent heat

$$
Q = mL
$$

**Symbols:** $L$ is specific latent heat (J/kg): for water, fusion $3.34 \times 10^5$ J/kg and vaporisation $2.26 \times 10^6$ J/kg.

**Use it when:** a substance melts, freezes, boils or condenses at constant temperature.

**Example:** Melting 0.50 kg of ice at 0 °C takes $0.50 \times 3.34 \times 10^5 = 1.67 \times 10^5$ J.

### 64. Ideal gas law

$$
PV = nRT
$$

**Symbols:** $P$ in Pa, $V$ in m³, $n$ in moles, $T$ in K.

**Use it when:** gases are at low to moderate pressure and not close to condensing.

**Example:** 1 mol of gas at 273.15 K and 101,325 Pa occupies $V = nRT/P = 0.0224$ m³, or 22.4 L.

### 65. Combined gas law

$$
\frac{P_1 V_1}{T_1} = \frac{P_2 V_2}{T_2}
$$

**Use it when:** a fixed amount of gas changes state. Use absolute pressure, not gauge pressure.

**Example:** A tyre at 300 kPa absolute and 293 K (20 °C) cools to 263 K (−10 °C) at roughly constant volume: $P_2 = 300 \times 263 / 293 = 269$ kPa.

### 66. Kinetic theory of gases

$$
\overline{KE} = \tfrac{3}{2}k_B T, \qquad v_{\text{rms}} = \sqrt{\frac{3k_B T}{m}}
$$

**Symbols:** $m$ is the mass of one molecule (kg).

**Use it when:** linking temperature to the motion of gas molecules.

**Example:** At 300 K, each molecule has an average translational kinetic energy of $6.21 \times 10^{-21}$ J. For nitrogen ($m = 4.65 \times 10^{-26}$ kg), $v_{\text{rms}} \approx 517$ m/s.

### 67. First law of thermodynamics

$$
\Delta U = Q - W
$$

**Symbols:** $\Delta U$ is change in internal energy, $Q$ is heat added to the system, $W$ is work done *by* the system (all in J). Some textbooks define $W$ as work done *on* the system and write $\Delta U = Q + W$; check which convention your course uses.

**Use it when:** tracking energy in gases, engines and refrigerators.

**Example:** A gas absorbs 500 J of heat and does 200 J of work pushing a piston, so $\Delta U = 300$ J.

### 68. Heat conduction

$$
P = \frac{kA\,\Delta T}{d}
$$

**Symbols:** $P$ is heat flow rate (W), $k$ is thermal conductivity (W/(m·K)), $A$ is area (m²), $d$ is thickness (m).

**Use it when:** heat flows steadily through a slab such as a wall or a window.

**Example:** Heat through 10 m² of insulation with $k = 0.040$ W/(m·K), 0.10 m thick, with a 20 K temperature difference: $P = 0.040 \times 10 \times 20 / 0.10 = 80$ W.

### 69. Stefan–Boltzmann law

$$
P = \varepsilon\sigma A T^4
$$

**Symbols:** $\varepsilon$ is emissivity (0 to 1), $A$ is surface area (m²), $T$ is surface temperature (K).

**Use it when:** calculating thermal radiation. The net loss to surroundings at $T_s$ is $\varepsilon\sigma A(T^4 - T_s^4)$.

**Example:** Skin at 306 K, area 1.8 m², $\varepsilon = 0.97$, radiates about 870 W, but in a 293 K room it also absorbs radiation, so the net loss is about 140 W. Clothing reduces this further.

### 70. Carnot efficiency

$$
\eta_{\max} = 1 - \frac{T_C}{T_H}
$$

**Symbols:** $T_H$ and $T_C$ are the hot and cold reservoir temperatures in kelvins.

**Use it when:** finding the maximum possible efficiency of any heat engine between two temperatures. Real engines do worse.

**Example:** An engine working between 800 K and 300 K can be at most $1 - 300/800 = 62.5\%$ efficient.

## Electricity

Charge, fields, circuits and capacitors ([OpenStax University Physics Volume 2, chapters 5–10](https://openstax.org/details/books/university-physics-volume-2)).

### 71. Coulomb's law

$$
F = k\frac{|q_1 q_2|}{r^2}
$$

**Use it when:** finding the force between two point charges. Like charges repel; unlike charges attract.

**Example:** Two 1.0 µC charges 0.10 m apart push each other with $8.99 \times 10^9 \times 10^{-12} / 0.010 = 0.899$ N.

### 72. Electric field of a point charge

$$
E = \frac{F}{q} = k\frac{|Q|}{r^2}
$$

**Symbols:** $E$ in N/C (equivalently V/m).

**Use it when:** describing the force per unit charge around a charge.

**Example:** At 0.10 m from a 1.0 nC charge, $E = 8.99 \times 10^9 \times 10^{-9} / 0.010 = 899$ N/C.

### 73. Uniform electric field

$$
E = \frac{V}{d}
$$

**Use it when:** a voltage $V$ is applied across parallel plates a distance $d$ apart.

**Example:** 12 V across plates 4.0 mm apart gives $E = 12 / 0.0040 = 3000$ V/m.

### 74. Work done moving a charge

$$
W = qV
$$

**Use it when:** a charge moves through a potential difference. This defines the electronvolt: 1 eV = $1.602 \times 10^{-19}$ J.

**Example:** Moving 1 C through a 12 V battery transfers 12 J. An electron accelerated through 1 V gains 1 eV.

### 75. Electric current

$$
I = \frac{Q}{t}
$$

**Symbols:** $I$ in amperes (1 A = 1 C/s).

**Use it when:** relating charge flow to time, such as battery capacity.

**Example:** A battery rated 3,000 mAh can deliver 3.0 A for one hour, a total charge of $3.0 \times 3600 = 10{,}800$ C.

### 76. Ohm's law

$$
V = IR
$$

**Use it when:** a component has constant resistance (an ohmic conductor at steady temperature).

**Example:** 9.0 V across a 450 Ω resistor drives $I = 9.0 / 450 = 0.020$ A, or 20 mA.

### 77. Resistance and resistivity

$$
R = \frac{\rho L}{A}
$$

**Symbols:** $\rho$ is resistivity (Ω·m; copper $\approx 1.68 \times 10^{-8}$ Ω·m), $L$ is length (m), $A$ is cross-sectional area (m²).

**Use it when:** choosing wire sizes or explaining why long, thin wires resist more.

**Example:** 10 m of 1.5 mm² copper wire has $R = 1.68 \times 10^{-8} \times 10 / (1.5 \times 10^{-6}) = 0.112$ Ω.

### 78. Electrical power

$$
P = VI = I^2R = \frac{V^2}{R}
$$

**Use it when:** finding the rate a component uses energy. Pick the form that uses the quantities you know.

**Example:** A 2,000 W kettle on 230 V draws $I = 2000 / 230 = 8.7$ A and has a resistance of $230^2 / 2000 = 26.5$ Ω.

### 79. Resistors in series

$$
R_{\text{total}} = R_1 + R_2 + R_3 + \cdots
$$

**Use it when:** components are connected end to end, with one path for current.

**Example:** 100 Ω, 220 Ω and 330 Ω in series make 650 Ω.

### 80. Resistors in parallel

$$
\frac{1}{R_{\text{total}}} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots
$$

**Use it when:** components connect across the same two points. The total is always less than the smallest resistor.

**Example:** 100 Ω and 220 Ω in parallel give $1/(0.01 + 0.004545) = 68.8$ Ω. Two equal resistors in parallel give half of one.

### 81. Capacitance

$$
C = \frac{Q}{V}, \qquad C_{\text{parallel plate}} = \frac{\varepsilon_0 A}{d}
$$

**Symbols:** $C$ in farads (F), $A$ is plate area (m²), $d$ is separation (m), for plates separated by vacuum or air.

**Use it when:** relating stored charge to voltage.

**Example:** Two 0.010 m² plates 1.0 mm apart in air have $C = 8.85 \times 10^{-12} \times 0.010 / 0.0010 = 88.5$ pF.

### 82. Energy stored in a capacitor

$$
U = \tfrac{1}{2}CV^2
$$

**Use it when:** finding how much energy a charged capacitor holds.

**Example:** A 100 µF capacitor charged to 300 V, as in a camera flash, stores $\tfrac{1}{2}(100 \times 10^{-6})(300^2) = 4.5$ J.

### 83. RC time constant

$$
\tau = RC, \qquad V_C(t) = V_0\left(1 - e^{-t/\tau}\right)
$$

**Use it when:** a capacitor charges or discharges through a resistor.

**Example:** With $R = 10$ kΩ and $C = 100$ µF, $\tau = 1.0$ s. After 1 s the capacitor reaches 63.2% of the supply voltage, and after $5\tau$ it is over 99% charged.

### 84. Electrical energy

$$
E = Pt
$$

**Use it when:** working out energy use and electricity bills. With $P$ in kW and $t$ in hours, $E$ is in kWh (1 kWh = $3.6 \times 10^6$ J).

**Example:** A 2.0 kW kettle running for 3 minutes (0.05 h) uses 0.10 kWh. Multiply by your tariff per kWh to get the cost.

## Magnetism and induction

Magnetic forces, fields from currents, and Faraday's law ([OpenStax University Physics Volume 2, chapters 11–14](https://openstax.org/details/books/university-physics-volume-2)).

### 85. Magnetic force on a moving charge

$$
F = qvB\sin\theta
$$

**Symbols:** $B$ is magnetic field (tesla, T), $\theta$ is the angle between $v$ and $B$.

**Use it when:** charges move through a magnetic field, as in mass spectrometers and particle accelerators.

**Example:** A proton at $1.0 \times 10^6$ m/s moving perpendicular to a 0.50 T field feels $1.602 \times 10^{-19} \times 10^6 \times 0.50 = 8.0 \times 10^{-14}$ N.

### 86. Magnetic force on a current-carrying wire

$$
F = BIL\sin\theta
$$

**Use it when:** designing motors and loudspeakers, or predicting forces on wires in a field.

**Example:** A 0.20 m wire carrying 5.0 A at right angles to a 0.10 T field feels $0.10 \times 5.0 \times 0.20 = 0.10$ N.

### 87. Magnetic field of a long straight wire

$$
B = \frac{\mu_0 I}{2\pi r}
$$

**Use it when:** finding the field at distance $r$ from a long straight current.

**Example:** 10 A at 5.0 cm gives $B = 4.0 \times 10^{-5}$ T, or 40 µT, similar to Earth's field. That is why a compass near a heavy DC cable is unreliable.

### 88. Magnetic field inside a solenoid

$$
B = \mu_0 n I
$$

**Symbols:** $n$ is turns per metre of length.

**Use it when:** a long coil produces a nearly uniform field inside, as in electromagnets and MRI magnets.

**Example:** 1,000 turns/m carrying 2.0 A gives $B = 1.257 \times 10^{-6} \times 1000 \times 2.0 = 2.5$ mT.

### 89. Magnetic flux

$$
\Phi = BA\cos\theta
$$

**Symbols:** $\Phi$ in webers (Wb), $\theta$ is the angle between $B$ and the normal to the area.

**Use it when:** setting up induction problems.

**Example:** A 0.20 T field through a 0.010 m² loop tilted at 60° gives $\Phi = 0.20 \times 0.010 \times 0.5 = 1.0 \times 10^{-3}$ Wb.

### 90. Faraday's law of induction

$$
\varepsilon = -N\frac{\Delta\Phi}{\Delta t}
$$

**Symbols:** $\varepsilon$ is induced voltage (V), $N$ is number of turns. The minus sign is Lenz's law: the induced current opposes the change.

**Use it when:** a changing magnetic flux through a coil generates a voltage, as in generators, transformers and induction hobs.

**Example:** A 200-turn coil whose flux changes by $1.0 \times 10^{-3}$ Wb in 0.050 s produces $200 \times 0.001 / 0.050 = 4.0$ V.

### 91. Ideal transformer

$$
\frac{V_s}{V_p} = \frac{N_s}{N_p}
$$

**Use it when:** stepping AC voltage up or down. In an ideal transformer, power in equals power out, so current changes the opposite way.

**Example:** A transformer with 2,000 primary turns and 100 secondary turns steps 230 V down to $230 \times 100 / 2000 = 11.5$ V.

## Optics

Refraction, lenses and interference ([OpenStax University Physics Volume 3, chapters 1–3](https://openstax.org/details/books/university-physics-volume-3)).

### 92. Snell's law and refractive index

$$
n_1\sin\theta_1 = n_2\sin\theta_2, \qquad n = \frac{c}{v}
$$

**Symbols:** $n$ is refractive index (air $\approx 1.00$, water $\approx 1.33$, glass $\approx 1.5$), angles are measured from the normal.

**Use it when:** light crosses a boundary between materials.

**Example:** Light entering water from air at 30° bends to $\theta_2 = \arcsin(0.5 / 1.33) = 22.1°$.

### 93. Critical angle

$$
\sin\theta_c = \frac{n_2}{n_1}, \qquad n_1 > n_2
$$

**Use it when:** light travels from a denser to a less dense medium. Beyond $\theta_c$, all the light reflects (total internal reflection).

**Example:** For glass ($n = 1.5$) to air, $\theta_c = 41.8°$; for water to air, $48.8°$.

### 94. Thin lens equation and magnification

$$
\frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}, \qquad m = -\frac{d_i}{d_o}, \qquad P = \frac{1}{f}
$$

**Symbols:** $f$ is focal length, $d_o$ object distance, $d_i$ image distance, $m$ magnification. Lens power $P$ is in dioptres when $f$ is in metres. Sign conventions vary between textbooks; this uses the common one where real images have positive $d_i$.

**Use it when:** finding where a lens forms an image and how big it is.

**Example:** An object 30 cm from a 10 cm converging lens forms a real image at $d_i = 15$ cm with $m = -0.5$: inverted and half size. A lens with $f = 0.10$ m has a power of +10 D; a −2.5 D spectacle lens has $f = -0.40$ m.

### 95. Double-slit interference

$$
d\sin\theta = m\lambda, \qquad \Delta y \approx \frac{\lambda L}{d}
$$

**Symbols:** $d$ is slit separation, $m$ is the order of the bright fringe, $L$ is distance to the screen, $\Delta y$ is fringe spacing (small-angle approximation).

**Use it when:** measuring wavelengths with slits or diffraction gratings.

**Example:** Red laser light (650 nm) through slits 0.10 mm apart onto a screen 2.0 m away gives fringes $650 \times 10^{-9} \times 2.0 / 10^{-4} = 13$ mm apart.

## Modern physics

Photons, matter waves, mass-energy and radioactive decay ([OpenStax University Physics Volume 3, chapters 5–10](https://openstax.org/details/books/university-physics-volume-3)).

### 96. Photon energy

$$
E = hf = \frac{hc}{\lambda}
$$

**Use it when:** relating light's frequency or wavelength to the energy of each photon.

**Example:** Green light at 500 nm carries $E = hc/\lambda = 3.97 \times 10^{-19}$ J, or 2.48 eV, per photon. A handy shortcut: $E\,(\text{eV}) \approx 1240 / \lambda\,(\text{nm})$.

### 97. Photoelectric equation

$$
KE_{\max} = hf - \phi
$$

**Symbols:** $\phi$ is the work function of the metal (J or eV), the minimum energy to release an electron.

**Use it when:** light ejects electrons from a surface. If $hf < \phi$, no electrons are emitted however bright the light.

**Example:** 400 nm light (3.10 eV photons) on a metal with $\phi = 2.3$ eV ejects electrons with up to 0.80 eV of kinetic energy.

### 98. De Broglie wavelength

$$
\lambda = \frac{h}{p} = \frac{h}{mv}
$$

**Use it when:** finding the wavelength of a moving particle (for speeds well below $c$).

**Example:** An electron at $1.0 \times 10^6$ m/s has $\lambda = 6.626 \times 10^{-34} / (9.109 \times 10^{-31} \times 10^6) = 0.73$ nm, comparable to the spacing of atoms in a crystal, which is why electrons diffract off crystals.

### 99. Mass–energy equivalence

$$
E = mc^2
$$

**Use it when:** relating rest mass to energy, for example in nuclear reactions, where the products have slightly less mass than the reactants.

**Example:** Converting 1.0 g of mass entirely to energy would release $10^{-3} \times (3.0 \times 10^8)^2 = 9.0 \times 10^{13}$ J, about 25 GWh.

### 100. Radioactive decay and half-life

$$
N = N_0\left(\tfrac{1}{2}\right)^{t/T_{1/2}} = N_0 e^{-\lambda t}, \qquad \lambda = \frac{\ln 2}{T_{1/2}}
$$

**Symbols:** $N_0$ is the starting number of nuclei, $T_{1/2}$ the half-life, $\lambda$ the decay constant.

**Use it when:** predicting how much of a radioactive sample remains, or dating a sample from what remains.

**Example:** Carbon-14 has a half-life of about 5,730 years. After 11,460 years (two half-lives), 25% remains. Its decay constant is $\ln 2 / 5730 = 1.21 \times 10^{-4}$ per year.

## How to use physics formulas well

Knowing a formula is only half the job. These habits prevent most lost marks:

- **Convert to SI units first.** Kilometres per hour, grams, centimetres and minutes cause more wrong answers than hard physics. Convert to metres, kilograms and seconds before substituting.
- **Check the conditions.** The kinematics equations need constant acceleration. The projectile range formula needs equal launch and landing heights. The pendulum formula needs small angles. Ohm's law needs constant resistance.
- **Use kelvins for gases and radiation.** $PV = nRT$, $P = \varepsilon\sigma AT^4$ and Carnot efficiency are wrong with Celsius values.
- **Use radians for rotation.** $v = \omega r$ and $a_t = \alpha r$ only work with angles in radians.
- **Check units at the end.** If a speed comes out in kg·m, something went wrong. Dimensional analysis catches many algebra slips.
- **Estimate the size.** A car's braking distance should be metres, not kilometres. A household current should be a few amps, not thousands.
- **Watch sign conventions.** The first law of thermodynamics, the thin lens equation and the Doppler formula all have competing conventions. Use the one your course uses, consistently.

## Next steps

- Understand the ideas behind each formula in [100 physics concepts explained with real-world examples](/articles/physics-concepts-explained-with-examples), which follows the same topic order.
- Measure $g$ with formula 51 or the speed of light with formula 53 using our [101 physics experiments you can do at home](/articles/physics-experiments-at-home).
- See the formulas applied to devices and daily life in [100 applications of physics in everyday life](/articles/applications-of-physics-in-everyday-life).
- Brush up on the algebra, trigonometry and calculus these formulas rely on with [100 mathematics formulas every student should know](/articles/math-formulas-every-student-should-know).
- Browse more articles and blogs in the [physics category](/category/physics).

## References

- *University Physics Volume 1*, William Moebs, Samuel J. Ling and Jeff Sanny, OpenStax (2016). https://openstax.org/details/books/university-physics-volume-1
- *University Physics Volume 2*, Samuel J. Ling, Jeff Sanny and William Moebs, OpenStax (2016). https://openstax.org/details/books/university-physics-volume-2
- *University Physics Volume 3*, Samuel J. Ling, Jeff Sanny and William Moebs, OpenStax (2016). https://openstax.org/details/books/university-physics-volume-3
- *College Physics 2e*, Paul Peter Urone and Roger Hinrichs, OpenStax (2022). https://openstax.org/details/books/college-physics-2e
- "Fundamental Physical Constants: 2022 CODATA values", NIST Physical Measurement Laboratory. https://physics.nist.gov/cuu/Constants/
- P. J. Mohr, D. B. Newell, B. N. Taylor and E. Tiesinga, "CODATA Recommended Values of the Fundamental Physical Constants: 2022", *Reviews of Modern Physics* 97, 025002 (2025). https://doi.org/10.1103/RevModPhys.97.025002
- "The International System of Units (SI)", Bureau International des Poids et Mesures (BIPM). https://www.bipm.org/en/measurement-units
- "Earth Fact Sheet", NASA Space Science Data Coordinated Archive. https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
