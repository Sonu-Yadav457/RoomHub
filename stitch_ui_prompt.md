# 🏛️ RoomHub — Stitch UI Generation Prompt
### University Empty Classroom Finder | React + Tailwind CSS | Production-Ready

---

## 📋 PROJECT OVERVIEW

Build a complete, production-ready React + Tailwind CSS web application called **RoomHub** — a real-time empty classroom finder for Delhi's top engineering universities. The app connects to a live Node.js/Express/MongoDB backend running at `http://localhost:5000`.

The app has **three pages**:
1. **Landing Page** (`/`) — Pick your university (DTU / NSUT / IGDTUW)
2. **Departments Page** (`/departments/:collegeId`) — Browse all departments of the selected university
3. **Rooms Page** (`/rooms/:departmentId`) — View all rooms for the selected department, split into **Available** and **Occupied** tabs

Navigation is strictly **forward-linear** via clicking cards. Every page has a back button in the Navbar that goes to the previous page.

---

## 🛠️ TECH STACK

- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS v3
- **Routing:** React Router DOM v6 (`useNavigate`, `useParams`)
- **State Management:** React `useState` + `useEffect` only (no Redux / Zustand)
- **HTTP Client:** Native `fetch` API (no axios)
- **Icons:** Lucide React (`npm install lucide-react`)

---

## 🔌 BACKEND API — COMPLETE SPECIFICATION

**Base URL:** `http://localhost:5000/api`

All endpoints return JSON. No authentication required. CORS is enabled.

### API 1 — Get All Universities
```
GET /api/colleges
```
**Response:**
```json
[
  { "_id": "mongo_objectid", "name": "Delhi Technological University", "shortCode": "DTU", "createdAt": "..." },
  { "_id": "mongo_objectid", "name": "Netaji Subhas University of Technology", "shortCode": "NSUT", "createdAt": "..." },
  { "_id": "mongo_objectid", "name": "Indira Gandhi Delhi Technical University for Women", "shortCode": "IGDTUW", "createdAt": "..." }
]
```

### API 2 — Get Departments by College
```
GET /api/departments/college/:collegeId
```
- `:collegeId` = `_id` from the college object
**Response:**
```json
[
  { "_id": "dept_id", "collegeId": "college_id", "name": "Computer Science Engineering", "shortCode": "CSE", "createdAt": "..." },
  { "_id": "dept_id", "collegeId": "college_id", "name": "Electronics & Communication", "shortCode": "ECE", "createdAt": "..." }
]
```

### API 3 — Get Rooms by Department
```
GET /api/rooms/department/:departmentId
```
- `:departmentId` = `_id` from the department object
**Response:**
```json
[
  {
    "_id": "room_id",
    "departmentId": "dept_id",
    "roomNumber": "CS-101",
    "isOccupied": false,
    "currentClass": "",
    "lastUpdatedBy": "System",
    "updatedAt": "2024-06-06T10:30:00.000Z"
  },
  {
    "_id": "room_id",
    "departmentId": "dept_id",
    "roomNumber": "CS-102",
    "isOccupied": true,
    "currentClass": "CO202 - Data Structures Lecture",
    "lastUpdatedBy": "Verified Student",
    "updatedAt": "2024-06-06T09:00:00.000Z"
  }
]
```

### API 4 — Toggle Room Status (Crowdsourcing)
```
PATCH /api/rooms/:roomId/toggle
Content-Type: application/json

Body (mark occupied): { "isOccupied": true, "currentClass": "CO202 - Data Structures" }
Body (mark free):     { "isOccupied": false, "currentClass": "" }
```
**Response:**
```json
{
  "message": "Room status updated successfully!",
  "room": { ...full updated room object... }
}
```

---

## 📁 FILE STRUCTURE TO GENERATE

```
src/
├── main.jsx
├── App.jsx
├── index.css
├── api/
│   └── api.js                      ← All API call functions
├── pages/
│   ├── LandingPage.jsx             ← Page 1: University selector
│   ├── DepartmentsPage.jsx         ← Page 2: Department cards
│   └── RoomsPage.jsx               ← Page 3: Rooms with Available/Occupied tabs
├── components/
│   ├── Navbar.jsx                  ← Shared sticky top navigation bar
│   ├── UniversityCard.jsx          ← Clickable university card (Landing)
│   ├── DepartmentCard.jsx          ← Clickable department card (Departments)
│   ├── RoomCard.jsx                ← Room status card (Rooms)
│   ├── StatusBadge.jsx             ← Free / Occupied pill badge
│   ├── TabBar.jsx                  ← Available / Occupied tab switcher
│   ├── SearchBar.jsx               ← Room number search input
│   ├── StatsStrip.jsx              ← Free / Occupied / Total counts
│   ├── ToggleModal.jsx             ← Crowdsourcing status modal
│   ├── Toast.jsx                   ← Success / error notification
│   └── LoadingSkeleton.jsx         ← Shimmer placeholder cards
└── hooks/
    └── useRooms.js                 ← Custom hook: fetch + manage rooms state
```

---

## 📄 PAGE 1 — LANDING PAGE (`/`)

### Purpose
User picks their university. On click, navigate to `/departments/:collegeId`.

### Layout
- Full-viewport: `min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 py-16`
- Centered hero header at top
- 3 university cards in a responsive grid below

### Hero Header
```
Large gradient wordmark:  "RoomHub"
  → text-5xl font-extrabold
  → gradient: bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent

Tagline below: "Find empty classrooms in real-time across Delhi's top universities"
  → text-gray-400 text-lg mt-3 text-center max-w-lg
```

### Data Loading
- On mount: call `GET /api/colleges`
- While loading: show 3 skeleton card placeholders (`skeleton` class)
- On error: centered error box — `"Could not connect to the server. Make sure the backend is running on port 5000."` + a `"Retry"` button that re-calls the API

### University Cards Grid
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full max-w-4xl
```

### UniversityCard Component (per college from API)
```
bg-gray-900 border border-gray-700 rounded-2xl p-8
flex flex-col items-center gap-4
hover:scale-105 hover:border-[accentColor] transition-all duration-300 cursor-pointer
hover:shadow-[0_0_40px_rgba(accent,0.25)]
```
**Card content (top to bottom):**
1. Large shortCode badge — rounded square, 80×80px, bold 2xl text centered
   - Background: `[accentColor]/15`, border: `[accentColor]/30`, text: `[accentColor]`
2. Full university `name` — `text-white font-semibold text-center text-base mt-1`
3. Chevron right icon (Lucide `ChevronRight`) — `text-gray-500 mt-2`

**Per-university accent colors (applied dynamically from `shortCode`):**
| shortCode | Accent (Tailwind) | Glow |
|---|---|---|
| DTU | `indigo-500` | `rgba(99,102,241,0.25)` |
| NSUT | `emerald-500` | `rgba(16,185,129,0.25)` |
| IGDTUW | `rose-500` | `rgba(244,63,94,0.25)` |

**On click:**
```javascript
localStorage.setItem('selectedCollege', JSON.stringify(college));
navigate(`/departments/${college._id}`);
```

---

## 📄 PAGE 2 — DEPARTMENTS PAGE (`/departments/:collegeId`)

### Purpose
Show all departments of the selected university as a grid of clickable cards. On click, navigate to `/rooms/:departmentId`.

### Navbar (top of page)
```
← Back (navigate to "/")  |  [University shortCode]  |  RoomHub
```
- Read college name from `localStorage.getItem('selectedCollege')`
- `bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-40`

### Page Header (below navbar)
```
"Departments"                            ← text-3xl font-bold text-white
"[University full name] · [X] branches" ← text-gray-400 text-sm mt-1
```
- X = count of departments returned from API

### Data Loading
- On mount: call `GET /api/departments/college/:collegeId` (from `useParams`)
- While loading: show 6 skeleton card placeholders in a grid
- On error: centered error message + Retry button
- If empty array: `"No departments found for this university."` centered with a sad icon

### Department Cards Grid
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-4 py-6 max-w-5xl mx-auto
```

### DepartmentCard Component (per department from API)
```
bg-gray-900 border border-gray-700 rounded-2xl p-6
flex items-center gap-4
hover:border-indigo-500/60 hover:bg-gray-800 hover:shadow-lg
transition-all duration-300 cursor-pointer
```
**Card content:**
1. Left: shortCode badge — `bg-indigo-500/15 border border-indigo-500/30 rounded-xl w-12 h-12 flex items-center justify-center text-indigo-400 font-bold text-sm`
2. Middle (flex-1):
   - `dept.name` — `text-white font-semibold text-sm`
   - `dept.shortCode` — `text-gray-500 text-xs mt-0.5`
3. Right: `ChevronRight` icon — `text-gray-600`

**On click:**
```javascript
localStorage.setItem('selectedDepartment', JSON.stringify(dept));
navigate(`/rooms/${dept._id}`);
```

---

## 📄 PAGE 3 — ROOMS PAGE (`/rooms/:departmentId`)

### Purpose
Show all rooms for the selected department. Rooms are split into two clearly separate tabs: **Available** and **Occupied**. Each tab has its own room card grid. Users can toggle room status (crowdsourcing).

### Navbar (top of page)
```
← Back (navigate to "/departments/:collegeId")  |  [Dept shortCode]  |  RoomHub
```
- Read `selectedCollege._id` from localStorage to build the back link: `navigate('/departments/' + selectedCollege._id)`
- Read department from localStorage for display label

### Page Header
```
"[Department shortCode] Rooms"   ← text-3xl font-bold text-white
"[Department full name]"         ← text-gray-400 text-sm mt-1
```

### Data Loading — `useRooms` Custom Hook
On mount, call `GET /api/rooms/department/:departmentId` (from `useParams`).

Hook manages:
- `rooms` — full array from API
- `loading` — boolean
- `error` — string or null
- `updateRoom(updatedRoom)` — replaces one room in the array by `_id`

### Stats Strip (`<StatsStrip>`)
Displayed directly below the page header, above the search bar.
```
Row of 3 chips:
🟢 [freeCount] Available  |  🔴 [occupiedCount] Occupied  |  🏫 [total] Total
```
- Calculated from the full `rooms` array (not filtered — always show global counts)
- Chip style: `bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2 text-sm`
- Free count: `text-emerald-400`
- Occupied count: `text-red-400`
- Total: `text-gray-300`

### Search Bar (`<SearchBar>`)
```
bg-gray-800 border border-gray-700 rounded-xl px-4 py-3
w-full max-w-md text-white placeholder-gray-500
```
- Placeholder: `"Search room number... e.g. CS-101"`
- Lucide `Search` icon inside left padding
- Clear (Lucide `X`) button appears when query is non-empty
- Filters BOTH tab arrays client-side — no API call:
  ```javascript
  room.roomNumber.toLowerCase().includes(query.toLowerCase())
  ```
- Auto-focus on mount; press `Escape` clears the query

### Tab Bar (`<TabBar>`)

Two tabs displayed as a pill toggle below the search bar:
```
[  🟢 Available (X)  ]  [  🔴 Occupied (Y)  ]
```
- Outer container: `bg-gray-800 rounded-xl p-1 flex gap-1 w-fit`
- Inactive tab: `text-gray-400 px-5 py-2 rounded-lg text-sm font-medium`
- Active tab:
  - If "Available": `bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`
  - If "Occupied": `bg-red-500/20 text-red-400 border border-red-500/30`
- `X` and `Y` = count of filtered rooms in each tab (respects current search query)
- Default active tab: **Available**

### Room Card Grid (inside active tab)
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4
```
- Rooms shown = rooms where `isOccupied === false` (Available tab) or `isOccupied === true` (Occupied tab), further filtered by search query
- Each card = `<RoomCard room={room} onToggle={handleToggle} />`

**Empty State per tab:**
- Available tab empty: `"🎉 All rooms in this department are currently in use."` + `text-gray-500 text-center py-16`
- Occupied tab empty: `"✅ No rooms are currently occupied in this department."` + same style
- Search returns nothing: `"No rooms match your search for '[query]'"` + `text-gray-500 text-center py-16`

---

### RoomCard Component — FULL SPECIFICATION

**Shell:**
```
bg-gray-900 border rounded-2xl p-5
flex flex-col gap-3
transition-all duration-300 cursor-default
```

**Dynamic border (based on `isOccupied`):**
- Available: `border-emerald-500/30 hover:border-emerald-500/70`
- Occupied: `border-red-500/30 hover:border-red-500/70`

**Top Row:**
```
Left:  room.roomNumber  → text-xl font-bold text-white
Right: <StatusBadge isOccupied={room.isOccupied} />
```

**StatusBadge Component:**
- **Available** → `bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full px-3 py-1 text-xs font-semibold`
  - Prepend a small pulsing green dot: `w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-dot inline-block mr-1.5`
  - Text: `"Available"`
- **Occupied** → `bg-red-500/15 text-red-400 border border-red-500/30 rounded-full px-3 py-1 text-xs font-semibold`
  - Text: `"Occupied"`

**Middle Section (only if `isOccupied === true` AND `currentClass` is non-empty):**
```
📚 [room.currentClass]
→ text-gray-400 text-sm flex items-center gap-2
```

**Bottom Row:**
```
Left:  "Updated [getTimeAgo(room.updatedAt)]"  → text-gray-600 text-xs
Right: Toggle Button
```

**Toggle Button:**
- If Available → `"Mark Occupied"` — `bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg px-3 py-1.5 text-xs transition-colors`
- If Occupied → `"Mark Free"` — `bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg px-3 py-1.5 text-xs transition-colors`
- On click: open `<ToggleModal>` (defined below)

---

### ToggleModal Component — FULL SPECIFICATION

Triggered by clicking the toggle button on any room card. Sits in a portal at the top of the DOM.

**Backdrop:** `fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4`

**Modal Box:** `bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl`

**Layout (top to bottom):**

1. Title: `"Update Room Status"` — `text-white text-lg font-semibold`
2. Subtitle: `"Room [roomNumber]"` — `text-gray-400 text-sm mt-1`

3. **If marking OCCUPIED:**
   - Label: `"What class is happening? (optional)"` — `text-gray-400 text-sm mt-4`
   - Text input: `bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full text-white placeholder-gray-500 mt-2`
     - Placeholder: `"e.g. CO202 - Data Structures"`
   - Confirm button: `"Mark as Occupied"` — `bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl px-5 py-3 w-full mt-4 transition-colors`

4. **If marking FREE:**
   - Confirmation text: `"Confirm this room is now empty and available for students?"` — `text-gray-400 text-sm mt-4`
   - Confirm button: `"Mark as Available"` — `bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl px-5 py-3 w-full mt-4 transition-colors`

5. Cancel button (always shown below confirm): `"Cancel"` — `bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 font-medium rounded-xl px-5 py-3 w-full mt-2 transition-colors`

**On Confirm click:**
1. **Optimistic update:** immediately call `updateRoom({ ...room, isOccupied: !room.isOccupied, currentClass: enteredClass || '' })` to update local state
2. Close modal
3. Call `PATCH /api/rooms/:roomId/toggle` with `{ isOccupied: !room.isOccupied, currentClass }`
4. On success: show green Toast `"Room [roomNumber] marked as [Available/Occupied]!"`
5. On failure: **revert** optimistic update by calling `updateRoom(originalRoom)`, then show red Toast `"Update failed. Please try again."`

---

### Toast Component

Position: `fixed bottom-6 right-6 z-[60]`

```
Success: bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 rounded-xl px-5 py-3 text-sm font-medium shadow-xl backdrop-blur-sm
Error:   bg-red-900/80 border border-red-500/40 text-red-300 rounded-xl px-5 py-3 text-sm font-medium shadow-xl backdrop-blur-sm
```

- Auto-dismiss after 3 seconds
- Slide-in animation from right on appear; fade-out on dismiss

---

## 🔁 Auto-refresh (Rooms Page Only)

On the Rooms Page, set up a `setInterval` inside a `useEffect`:
- Every **60 seconds**, re-call `GET /api/rooms/department/:departmentId`
- Replace the `rooms` array in state with fresh data
- Show a subtle synced indicator in the top-right corner of the page header:
  ```
  "🔄 Last synced: X seconds ago"  → text-gray-600 text-xs
  ```
  - Reset counter to 0 after each sync
  - Count up every second with a separate `setInterval`
- **Clear both intervals on component unmount** (cleanup in useEffect return)

---

## 📦 `src/api/api.js` — COMPLETE IMPLEMENTATION

```javascript
const BASE_URL = 'http://localhost:5000/api';

export const fetchColleges = async () => {
  const res = await fetch(`${BASE_URL}/colleges`);
  if (!res.ok) throw new Error('Failed to fetch colleges');
  return res.json();
};

export const fetchDepartmentsByCollege = async (collegeId) => {
  const res = await fetch(`${BASE_URL}/departments/college/${collegeId}`);
  if (!res.ok) throw new Error('Failed to fetch departments');
  return res.json();
};

export const fetchRoomsByDepartment = async (departmentId) => {
  const res = await fetch(`${BASE_URL}/rooms/department/${departmentId}`);
  if (!res.ok) throw new Error('Failed to fetch rooms');
  return res.json();
};

export const toggleRoomStatus = async (roomId, isOccupied, currentClass = '') => {
  const res = await fetch(`${BASE_URL}/rooms/${roomId}/toggle`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isOccupied, currentClass }),
  });
  if (!res.ok) throw new Error('Failed to update room status');
  return res.json();
};
```

---

## 🔁 `src/hooks/useRooms.js` — CUSTOM HOOK

```javascript
import { useState, useEffect, useCallback } from 'react';
import { fetchRoomsByDepartment } from '../api/api';

export const useRooms = (departmentId) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRooms = useCallback(async () => {
    if (!departmentId) return;
    try {
      const data = await fetchRoomsByDepartment(departmentId);
      setRooms(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  useEffect(() => {
    setLoading(true);
    loadRooms();

    // Auto-refresh every 60 seconds
    const refreshInterval = setInterval(loadRooms, 60000);
    return () => clearInterval(refreshInterval);
  }, [loadRooms]);

  const updateRoom = (updatedRoom) => {
    setRooms((prev) =>
      prev.map((r) => (r._id === updatedRoom._id ? updatedRoom : r))
    );
  };

  return { rooms, loading, error, updateRoom, refetch: loadRooms };
};
```

---

## 🗺️ ROUTING — `src/App.jsx` — COMPLETE IMPLEMENTATION

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DepartmentsPage from './pages/DepartmentsPage';
import RoomsPage from './pages/RoomsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/departments/:collegeId" element={<DepartmentsPage />} />
        <Route path="/rooms/:departmentId" element={<RoomsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🎨 DESIGN SYSTEM

### Color Palette
```css
/* Backgrounds */
--bg-primary: #030712;    /* gray-950 — page background */
--bg-card: #111827;       /* gray-900 — cards, navbar */
--bg-elevated: #1f2937;   /* gray-800 — inputs, pills, chips */

/* Borders */
--border-default: #374151; /* gray-700 */
--border-subtle: #1f2937;  /* gray-800 */

/* Text */
--text-primary: #f9fafb;   /* gray-50 */
--text-secondary: #9ca3af; /* gray-400 */
--text-muted: #6b7280;     /* gray-500 */

/* Status */
--free: #10b981;           /* emerald-500 */
--occupied: #ef4444;       /* red-500 */
--accent: #6366f1;         /* indigo-500 */
```

### Typography
Add to `index.html` `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```
Add to `index.css`:
```css
body {
  font-family: 'Inter', sans-serif;
  background-color: #030712;
  color: #f9fafb;
}
```

### Animations — Add to `index.css`
```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.animate-pulse-dot {
  animation: pulse-dot 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 0.75rem;
}

@keyframes slide-in-right {
  from { transform: translateX(120%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
@keyframes fade-out {
  from { opacity: 1; }
  to   { opacity: 0; }
}
.toast-enter { animation: slide-in-right 0.3s ease-out forwards; }
.toast-exit  { animation: fade-out 0.3s ease-in forwards; }
```

---

## 📱 RESPONSIVENESS TABLE

| Breakpoint | Landing Page | Departments Page | Rooms Page |
|---|---|---|---|
| Mobile `< 640px` | 1-col card stack | 1-col card stack | 1-col grid, tabs full-width |
| Tablet `640–1024px` | 2-col card grid | 2-col card grid | 2-col grid |
| Desktop `> 1024px` | 3-col card grid | 3-col card grid | 3-col grid |

---

## ⚡ UX HELPER — TIME AGO FUNCTION

Use this in every component that displays `updatedAt`:
```javascript
const getTimeAgo = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  const diffHrs = Math.floor(diffMins / 60);
  return `${diffHrs} hr${diffHrs > 1 ? 's' : ''} ago`;
};
```

---

## 📦 Dependencies to Install

```
npm install react-router-dom lucide-react
```

---

## 🚫 DO NOT

- Do NOT use axios — use native `fetch` only
- Do NOT use Redux or Zustand — React state only
- Do NOT add authentication — backend has no auth
- Do NOT hardcode university/department/room data — always fetch from the real API
- Do NOT use light mode — **dark mode only** throughout all 3 pages
- Do NOT add a time-slot filter — the backend has no schedule/timetable data
- Do NOT add a capacity field on room cards — the Room schema has no capacity field
- Do NOT paginate — render all items returned from API
- Do NOT use a sidebar for departments on the Rooms page — departments are their own full page now

---

## ✅ FINAL CHECKLIST BEFORE RENDERING

**Landing Page:**
- [ ] `GET /api/colleges` called on mount
- [ ] University cards rendered dynamically from API response
- [ ] Per-university accent color applied from `shortCode`
- [ ] `selectedCollege` saved to localStorage on click
- [ ] Navigates to `/departments/:collegeId`
- [ ] Skeleton loading + error state + retry button

**Departments Page:**
- [ ] `GET /api/departments/college/:collegeId` called on mount (collegeId from `useParams`)
- [ ] College name read from localStorage for Navbar display
- [ ] Department count shown in page header
- [ ] `selectedDepartment` saved to localStorage on card click
- [ ] Navigates to `/rooms/:departmentId`
- [ ] Skeleton loading + error state + empty state

**Rooms Page:**
- [ ] `GET /api/rooms/department/:departmentId` called on mount (departmentId from `useParams`)
- [ ] `useRooms` custom hook manages all rooms state
- [ ] Stats strip shows correct Available / Occupied / Total counts
- [ ] Search bar filters both tab arrays client-side
- [ ] TabBar defaults to "Available" tab
- [ ] Available tab shows only `isOccupied === false` rooms
- [ ] Occupied tab shows only `isOccupied === true` rooms
- [ ] Tab counts update in real-time as search query changes
- [ ] Back button navigates to `/departments/:collegeId` (collegeId from localStorage)
- [ ] `PATCH /api/rooms/:id/toggle` called on modal confirm
- [ ] Optimistic UI update before API resolves
- [ ] Revert optimistic update if API fails
- [ ] Toast shown on success and failure
- [ ] ToggleModal implemented with class name input (for marking occupied)
- [ ] Auto-refresh every 60 seconds
- [ ] "Last synced: X seconds ago" counter shown
- [ ] Skeleton loading (6 cards) while rooms are loading
- [ ] Empty states for each tab
- [ ] Mobile responsive layout

**Global:**
- [ ] Dark mode only (`bg-gray-950` base)
- [ ] Inter font loaded in `index.html`
- [ ] Shimmer skeleton animation defined in `index.css`
- [ ] Pulse-dot animation defined in `index.css`
- [ ] Toast slide-in/fade-out animation defined in `index.css`
- [ ] All 3 routes defined in `App.jsx`
