# Family Trip App — Brisbane 2026
**Trip:** 30 July – 2 August 2026 | Taiwan → Brisbane

---

## Tech Stack
- **Frontend:** React Native (Expo)
- **Backend/Database:** Supabase (hosted PostgreSQL + file storage)
- **No server to run** — Supabase handles everything in the cloud

---

## Features
1. Timetable — day-by-day schedule view
2. Ticket Storage — upload and view booking confirmations
3. Event Details — full info per event (location, notes, contacts)

---

## How It Works
```
Your Phone (React Native app)  →  Supabase (always online, hosted by them)
```
- Data is stored in Supabase's cloud database
- Ticket images/PDFs are stored in Supabase Storage
- App works on your phone independently — laptop does not need to be on

---

## Task Breakdown

### Phase 1 — Project Setup
- [ ] 1.1 Initialise Expo React Native project (`npx create-expo-app`)
- [x] 1.2 Set up project folder structure
- [x] 1.3 Configure ESLint + Prettier
- [ ] 1.4 Set up Git repository and `.gitignore`
- [ ] 1.5 Create `.env` file for Supabase URL and anon key

---

### Phase 2 — Supabase Setup
#### Create Project
- [ ] 2.1 Sign up at supabase.com and create a new project
- [ ] 2.2 Copy project URL and anon key (used in the app)

#### Database Tables
- [ ] 2.3 Create `events` table
  - `id` (int, primary key)
  - `title` (text)
  - `date` (date)
  - `start_time` (time)
  - `end_time` (time)
  - `location` (text)
  - `notes` (text)
- [ ] 2.4 Create `tickets` table
  - `id` (int, primary key)
  - `event_id` (int, foreign key → events)
  - `file_name` (text)
  - `file_url` (text)
  - `uploaded_at` (timestamp)

#### Storage
- [ ] 2.5 Create a Storage bucket called `tickets` for uploading PDFs and images
- [ ] 2.6 Set bucket to private (only accessible via the app)

#### Install Client
- [ ] 2.7 Install Supabase JS client (`npm install @supabase/supabase-js`)
- [ ] 2.8 Install secure storage for keys (`npm install expo-secure-store`)
- [ ] 2.9 Create `lib/supabase.ts` — initialise and export the Supabase client

---

### Phase 3 — Frontend (React Native)
#### Navigation
- [ ] 3.1 Install React Navigation (`@react-navigation/native`)
- [ ] 3.2 Set up Bottom Tab Navigator (Timetable | Tickets)
- [ ] 3.3 Set up Stack Navigator for detail and form screens

#### Timetable Screen
- [ ] 3.4 Build day selector tabs (Jul 30, Jul 31, Aug 1, Aug 2)
- [ ] 3.5 Build event card component (time, title, location)
- [ ] 3.6 Fetch events from Supabase filtered by selected date
- [ ] 3.7 Sort events by start time
- [ ] 3.8 Add pull-to-refresh

#### Event Detail Screen
- [ ] 3.9 Build detail view (title, date, time, location, notes)
- [ ] 3.10 Add map link (opens Google Maps with the location)
- [ ] 3.11 Show associated tickets for the event
- [ ] 3.12 Add Edit and Delete buttons
- [ ] 3.13 Delete event from Supabase on confirm

#### Add / Edit Event Form
- [ ] 3.14 Build form (title, date picker, time pickers, location, notes)
- [ ] 3.15 Save new event to Supabase (`insert`)
- [ ] 3.16 Update existing event in Supabase (`update`)

#### Ticket Storage Screen
- [ ] 3.17 Build ticket list view grouped by event
- [ ] 3.18 Add upload button (pick image or PDF from device)
- [ ] 3.19 Upload file to Supabase Storage and save record to `tickets` table
- [ ] 3.20 Build ticket viewer (display image or open PDF)
- [ ] 3.21 Add delete ticket functionality

#### Shared Components
- [ ] 3.22 Loading spinner component
- [ ] 3.23 Empty state component ("No events yet")
- [ ] 3.24 Error toast / alert component

---

### Phase 4 — Data Entry
- [ ] 4.1 Add all trip events in the app
  - Flight arrival (Jul 30)
  - Accommodation check-in
  - Planned activities (Story Bridge, South Bank, Lone Pine Koala Sanctuary, etc.)
  - Departure (Aug 2)
- [ ] 4.2 Upload all booking confirmations and tickets
- [ ] 4.3 Fill in location and notes for each event

---

### Phase 5 — Polish & Testing
- [ ] 5.1 Style the app (colours, fonts, consistent spacing)
- [ ] 5.2 Test on Android phone using Expo Go during development
- [ ] 5.3 Test adding, editing, and deleting events
- [ ] 5.4 Test ticket upload and viewing on the phone
- [ ] 5.5 Add app icon and splash screen

---

### Phase 6 — Build & Install on Phone
- [ ] 6.1 Install EAS CLI (`npm install -g eas-cli`)
- [ ] 6.2 Configure `eas.json` with an Android preview profile
- [ ] 6.3 Run `eas build --platform android --profile preview` to generate `.apk`
- [ ] 6.4 Download the `.apk` from the Expo dashboard
- [ ] 6.5 Enable "Install unknown apps" on your Android phone
- [ ] 6.6 Install the `.apk` on your phone
- [ ] 6.7 Verify the app works fully without the laptop

---

## Folder Structure

```
FamilyTrip/
├── app/
│   ├── screens/
│   │   ├── TimetableScreen.tsx
│   │   ├── EventDetailScreen.tsx
│   │   ├── AddEditEventScreen.tsx
│   │   └── TicketsScreen.tsx
│   ├── components/
│   │   ├── EventCard.tsx
│   │   ├── DaySelector.tsx
│   │   └── LoadingSpinner.tsx
│   ├── navigation/
│   │   └── AppNavigator.tsx
│   └── lib/
│       └── supabase.ts        ← Supabase client lives here
├── assets/
├── .env                       ← Supabase URL + anon key (never commit this)
├── app.json
├── package.json
└── PLAN.md
```

---

## Timeline Suggestion

| Week | Focus |
|------|-------|
| Week 1 | Phase 1 + Phase 2 (Expo setup + Supabase) |
| Week 2 | Phase 3 (all screens) |
| Week 3 | Phase 4 (data entry) + Phase 5 (polish) |
| Week 4 (buffer) | Phase 6 (build APK + install on phone) |

> Trip is **30 Jul 2026** — aim to have the app ready by **mid-July**.
> Once the APK is installed, the laptop can stay home.
