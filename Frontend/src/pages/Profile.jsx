import React, { useEffect, useState } from "react";

export default function Profile({ user, darkMode }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [location, setLocation] = useState({
    lat: "",
    lng: "",
    address: "",
  });

  const backendURL = import.meta.env.VITE_BACKEND_URL || "https://planbackend-2.onrender.com";

  // Glassmorphism Styles
  const cardClass = `w-full max-w-3xl rounded-3xl p-8 shadow-2xl transition-all border backdrop-blur-xl ${darkMode
    ? "bg-slate-900/60 border-slate-700 text-slate-100"
    : "bg-white/60 border-white/50 text-slate-800"
    }`;

  const inputClass = `w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${darkMode
    ? "bg-black/40 border-slate-600 text-white placeholder-slate-400"
    : "bg-white/60 border-gray-200 text-slate-800 placeholder-slate-500"
    }`;

  // LOAD PROFILE
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`${backendURL}/api/users/${user._id}`, {
          credentials: "include",
        });

        if (res.status === 401) {
          setError("Session expired. Please login again.");
          return;
        }

        const data = await res.json();

        if (!data || !data.name) {
          setError("Failed to load profile.");
          return;
        }

        setProfile(data);
        setName(data.name);
        setEmail(data.email);

        if (data.location?.coordinates) {
          setLocation({
            lat: data.location.coordinates[1],
            lng: data.location.coordinates[0],
            address: data.location.address,
          });
        }
      } catch (err) {
        console.error(err);
        setError("Error fetching profile.");
      }
    };

    if (user) loadProfile();
  }, [user]);

  // UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const res = await fetch(`${backendURL}/api/users/${user._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.status === 401) {
        setError("Unauthorized. Please login again.");
        return;
      }

      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  // UPDATE LOCATION
  const updateLocation = async () => {
    try {
      const res = await fetch(`${backendURL}/api/users/${user._id}/location`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: location.lat,
          lng: location.lng,
          address: location.address,
        }),
      });

      if (res.status === 401) {
        setError("Unauthorized. Please login again.");
        return;
      }

      const updated = await res.json();
      setProfile(updated);
    } catch (err) {
      console.error(err);
    }
  };

  // DETECT LOCATION
  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          lat: coords.latitude,
          lng: coords.longitude,
          address: "Auto detected",
        });
      },
      () => alert("Location permission denied")
    );
  };

  if (error)
    return <div className="pt-32 text-center text-red-500 text-lg font-bold">{error}</div>;

  if (!profile)
    return <div className="pt-32 text-center text-lg animate-pulse opacity-70">Loading profile...</div>;

  const avatar = profile?.name
    ? profile.name.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="pt-28 px-6 flex flex-col items-center min-h-screen animate-fade-in relative z-10">
      <div className={cardClass}>
        <h1 className="text-4xl font-black text-center mb-8 tracking-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Profile
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-5xl font-bold flex items-center justify-center shadow-lg shadow-purple-500/30">
              {avatar}
            </div>
            <p className="mt-4 opacity-70 font-mono text-sm">{profile.email}</p>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-current/10">Personal Info</h2>

            {!editMode ? (
              <div className="space-y-4">
                <p className="text-lg"><strong className="opacity-70">Name:</strong> {profile.name}</p>
                <p className="text-lg"><strong className="opacity-70">Email:</strong> {profile.email}</p>

                <button
                  onClick={() => setEditMode(true)}
                  className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                >
                  Edit Profile ✏️
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  className={inputClass}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                />

                <input
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                />

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={updateProfile}
                    className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-500/20"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 bg-gray-500 text-white rounded-xl font-bold hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LOCATION */}
        <div className="mt-12 p-6 rounded-2xl border bg-current/5 border-current/10">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>📍</span> Location Settings
          </h2>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                className={inputClass}
                value={location.lat}
                onChange={(e) => setLocation({ ...location, lat: e.target.value })}
                placeholder="Latitude"
              />
              <input
                className={inputClass}
                value={location.lng}
                onChange={(e) => setLocation({ ...location, lng: e.target.value })}
                placeholder="Longitude"
              />
            </div>

            <input
              className={inputClass}
              value={location.address}
              onChange={(e) => setLocation({ ...location, address: e.target.value })}
              placeholder="Full Address / City"
            />

            <div className="flex gap-4 mt-2">
              <button
                onClick={detectLocation}
                className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition shadow-lg shadow-amber-500/20"
              >
                Detect Location 📡
              </button>

              <button
                onClick={updateLocation}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
              >
                Save Location 💾
              </button>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center opacity-40 text-sm">
          Last Updated: {new Date(profile.updatedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
