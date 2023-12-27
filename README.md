# Design Document for Synced Timer

## Context & Scope

It was part of a gig project for a client. The client wanted to have a timer for each room, it will be displayed on a device in the room. The timer will be synced with the admin's device. The admin can add extra time to the timer. The admin can also create a booking for the room. The timer will be displayed on the admin's device as well. The admin can also see the timer for all the rooms.

## Goals

- Syncing timer for multiple devices.
- Allow page refresh without losing timer.
- CRUD the timer
- CRUD the booking for the current and 1 next.

## Non-Goals

- Calculate the price for the booking.
- No advanced booking from a day ahead.

## Detailed Design
