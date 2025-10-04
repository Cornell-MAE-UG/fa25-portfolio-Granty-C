#!/usr/bin/env python3
"""
Actuated Rocker Calculator

Calculates geometry and payload capacity of a rocker arm driven by a linear actuator.
- Inputs: actuator force [lbf], stroke [in], body length [in], rocker radius [in], start angle θ0 [deg]
- End angle is fixed at 90°
- Outputs: ground spacing b [in], actuator pin radius r_a [in], lift h [in/cm], and W_max at θ0
"""

import math

def ask(txt): return float(input(f"{txt}: "))

def solve_geom(L0,L1,th0,th1=90):
    t0,t1=math.radians(th0),math.radians(th1)
    c0,c1=math.cos(t0),math.cos(t1)
    S0,S1=L0**2,L1**2
    R=(S1-S0)/(2*(c0-c1)); B=S1+2*R*c1
    s1=math.sqrt(max(0,B+2*R)); s2=math.sqrt(max(0,B-2*R))
    return 0.5*(s1+s2),0.5*(s1-s2)   # b, r_a

def w_max(F,rL,b,ra,th):
    L=math.sqrt(max(0,b*b+ra*ra-2*b*ra*math.cos(th)))
    return F*(b*ra/L)*math.sin(th)/(rL*max(math.cos(th),1e-9))

def main():
    print("\n=== Actuated Rocker Calculator ===")
    F   = ask("Actuator force [lbf]")
    s   = ask("Actuator stroke [in]")
    L0  = ask("Actuator body length (retracted) [in]")
    rL  = ask("Rocker radius rL [in]")
    th0 = ask("Start angle θ0 [deg]")

    b,ra=solve_geom(L0,L0+s,th0,90)
    lift=rL*(1-math.sin(math.radians(th0)))  # sin(90)=1
    W0=w_max(F,rL,b,ra,math.radians(th0))

    print(f"\nGround spacing b     = {b:.2f} in")
    print(f"Actuator pin radius r_a = {ra:.2f} in")
    print(f"Lift h               = {lift:.2f} in ({lift*2.54:.1f} cm)")
    print(f"W_max at θ0={th0:.1f}° = {W0:,.0f} lbf\n")

if __name__=="__main__": main()
