---
layout: post
title: "ExaHyPE - An Exascale Hyperbolic PDE Engine"
author: "Anne Reinarz"
categories: projects
tags: []
image: exa.jpg
---


ExaHyPE (“An Exascale Hyperbolic PDE Engine”) is a software engine for solving systems of first-order hyperbolic partial differential equations (PDEs). Hyperbolic PDEs are typically derived from the conservation laws of physics and are useful in a wide range of application areas. Applications powered by ExaHyPE can be run on a student’s laptop, but are also able to exploit thousands of processor cores on state-of-the-art supercomputers. The engine is able to dynamically increase the accuracy of the simulation using adaptive mesh refinement where required. Due to the robustness and shock capturing abilities of ExaHyPE’s numerical methods, users of the engine can simulate linear and non-linear hyperbolic PDEs with very high accuracy. Users can tailor the engine to their particular PDE by specifying evolved quantities, fluxes, and source terms. A complete simulation code for a new hyperbolic PDE can often be realised within a few hours — a task that, traditionally, can take weeks, months, often years for researchers starting from scratch.

- [Website](https://exahype.eu)
- [Release Paper](https://doi.org/10.1016/j.cpc.2020.107251)
- [Gitlab](https://gitlab.lrz.de/exahype/ExaHyPE-Engine)
