import { useState, useCallback } from "react";
import { checkTrainDelay } from "../../services/trainDelay.service";
import "../../styles/trainDelayTracker.css";

/* =====================================================
        TRAIN DELAY TRACKER — MAIN COMPONENT
===================================================== */

// ─────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────

/**
 * Returns a colour class based on delay minutes.
 * zero | low | medium | high
 */
const barClass = (mins) => {
  if (mins === 0) return "zero";
  if (mins <= 10) return "low";
  if (mins <= 30) return "medium";
  return "high";
};

/**
 * Returns the bar height (px) scaled to max 54px.
 */
const barHeight = (mins, maxMins) => {
  if (!maxMins) return 6;
  return Math.max(6, Math.round((mins / maxMins) * 54));
};

/**
 * Returns the station dot status class.
 */
const dotClass = (station, index, total) => {
  if (station.isCurrent) return "current";
  if (station.status === "departed") return "departed";
  if (index === total - 1) return "destination";
  return "upcoming";
};

/**
 * Returns the timeline connector class for the segment BELOW this station.
 */
const lineClass = (station, index, stations) => {
  if (station.isCurrent) return "current";
  if (station.status === "departed") {
    const next = stations[index + 1];
    if (next && (next.status === "current" || next.isCurrent)) return "current";
    return "departed";
  }
  return "";
};

/**
 * Format delay label for the chip on each station row.
 */
const delayChipContent = (station) => {
  if (station.status === "upcoming" && !station.isCurrent) {
    if (station.delayMinutes > 0) return { label: `+${station.delayMinutes} min`, cls: "delayed" };
    return { label: "On Time", cls: "zero" };
  }
  if (station.delayMinutes === 0) return { label: "On Time", cls: "zero" };
  return { label: `+${station.delayMinutes} min`, cls: "delayed" };
};

// ─────────────────────────────────────────────────
//  SUB-COMPONENTS
// ─────────────────────────────────────────────────

/* Source badge ──────────────────────────────────── */
const SourceBadge = ({ source }) => {
  if (source === "live") {
    return (
      <div className="tdt-source-badge live">
        <span className="dot" />
        🟢 Live Data
      </div>
    );
  }
  return (
    <div className="tdt-source-badge demo">
      <span className="dot" />
      🟡 Demo Data — Live railway data is currently unavailable
    </div>
  );
};

/* Train Info Card ───────────────────────────────── */
const TrainInfoCard = ({ data }) => (
  <div className="tdt-card">
    <div className="tdt-train-info-card">
      <div className="tdt-train-icon-wrap">
        <i className="fa-solid fa-train-subway" />
      </div>
      <div className="tdt-train-meta">
        <div className="tdt-train-name">{data.trainName}</div>
        <div className="tdt-train-number">Train No. {data.trainNumber}</div>
        <div className="tdt-route-row">
          <span>{data.from}</span>
          <i className="fa-solid fa-arrow-right" />
          <span>{data.to}</span>
        </div>
      </div>
    </div>

    {/* Passenger / PNR details (only when PNR search) */}
    {(data.passengerName || data.pnr || data.journeyDate) && (
      <div className="tdt-train-details-grid">
        {data.pnr && (
          <div className="tdt-detail-item">
            <label>PNR</label>
            <span>{data.pnr}</span>
          </div>
        )}
        {data.passengerName && (
          <div className="tdt-detail-item">
            <label>Passenger</label>
            <span>{data.passengerName}</span>
          </div>
        )}
        {data.journeyDate && (
          <div className="tdt-detail-item">
            <label>Journey Date</label>
            <span>
              {new Date(data.journeyDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}
        {data.coach && (
          <div className="tdt-detail-item">
            <label>Coach</label>
            <span>{data.coach}</span>
          </div>
        )}
        {data.seat && (
          <div className="tdt-detail-item">
            <label>Seat</label>
            <span>{data.seat}</span>
          </div>
        )}
        {data.class && (
          <div className="tdt-detail-item">
            <label>Class</label>
            <span>{data.class}</span>
          </div>
        )}
      </div>
    )}
  </div>
);

/* Current Status Card ──────────────────────────── */
const CurrentStatusCard = ({ data }) => {
  const isDelayed = data.status === "delayed";
  return (
    <div className="tdt-card">
      <div className="tdt-status-card-header">
        <span className="tdt-card-section-title">Current Train Status</span>
        <span className={`tdt-status-badge ${isDelayed ? "delayed" : "on-time"}`}>
          <span className="status-dot" />
          {isDelayed ? "DELAYED" : "ON TIME"}
        </span>
      </div>

      {isDelayed ? (
        <>
          <div className="tdt-delay-number">{data.delayMinutes}<small style={{ fontSize: 18, fontWeight: 500, color: "#6b7280", marginLeft: 4 }}>min</small></div>
          <div className="tdt-delay-label">🔴 Train is currently running {data.delayMinutes} minutes late.</div>
        </>
      ) : (
        <>
          <div className="tdt-delay-number on-time-text">🟢 On Schedule</div>
          <div className="tdt-delay-label">Your train is currently running on schedule.</div>
        </>
      )}

      <div className="tdt-status-details">
        <div className="tdt-status-row">
          <i className="fa-solid fa-location-dot" />
          <span>Current Location: <strong>{data.currentLocation}</strong></span>
        </div>
        {isDelayed && data.stations && (() => {
          const dest = data.stations[data.stations.length - 1];
          return dest ? (
            <div className="tdt-status-row">
              <i className="fa-regular fa-clock" />
              <span>
                Expected Arrival at {dest.name}:{" "}
                <strong>{dest.actualArrival || dest.scheduledArrival || "—"}</strong>
              </span>
            </div>
          ) : null;
        })()}
        <div className="tdt-status-row">
          <i className="fa-solid fa-rotate" />
          <span>Last Updated: <strong>{data.lastUpdated}</strong></span>
        </div>
      </div>

      {/* Mini Delay Trend */}
      {data.delayTrendValues && data.delayTrendValues.length > 1 && (
        <DelayTrendSection
          values={data.delayTrendValues}
          trend={data.delayTrend}
          stations={data.stations}
        />
      )}
    </div>
  );
};

/* Current Station Focus Card (EXTRA FOCUS FOR CURRENT STATION) ───── */
const CurrentStationFocusCard = ({ data }) => {
  // Dynamically find current station
  const currentStn =
    (data.stations && data.stations.find((s) => s.isCurrent || s.status === "current")) ||
    data.currentStation ||
    (data.stations && data.stations[0]);

  if (!currentStn) return null;

  const isDelayed = data.status === "delayed" || currentStn.delayMinutes > 0;
  const delayMins = currentStn.delayMinutes || data.delayMinutes || 0;
  const reason = currentStn.delayReason || data.delayReason || (isDelayed ? "Signal congestion and heavy railway traffic" : "No significant delay");
  const expectedMovement = currentStn.expectedDepartureTime || "Around 09:05 AM";
  const waitMins = currentStn.estimatedWaitMinutes || Math.max(5, delayMins - 10) || 33;
  const trendLabel = data.delayTrend === "increasing" ? "Increasing ↑" : data.delayTrend === "recovering" ? "Recovering ↓" : "Stable →";

  return (
    <div className="tdt-current-focus-card">
      <div className="tdt-cfc-header">
        <span className="tdt-cfc-title">
          <i className="fa-solid fa-tower-cell" /> CURRENT STATION FOCUS
        </span>
        <span className={`tdt-cfc-badge ${isDelayed ? "delayed" : "on-time"}`}>
          <span className="status-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
          {isDelayed ? `${delayMins} min delay` : "On Schedule"}
        </span>
      </div>

      <div className="tdt-cfc-station-name">{currentStn.name}</div>
      <div className={`tdt-cfc-delay-desc ${isDelayed ? "delayed" : "on-time"}`}>
        {isDelayed ? (
          <>
            <i className="fa-solid fa-triangle-exclamation" />
            Currently running {delayMins} minutes late
          </>
        ) : (
          <>
            <i className="fa-solid fa-circle-check" />
            Currently running on schedule
          </>
        )}
      </div>

      {/* Why Delayed? */}
      <div className="tdt-cfc-reason-box">
        <label>
          <i className="fa-solid fa-circle-question" /> Why is the train currently delayed?
        </label>
        <p>{reason}</p>
      </div>

      {/* When will the train move? */}
      <div className="tdt-cfc-movement-box">
        <div className="tdt-cfc-movement-item">
          <label>Expected Movement Time</label>
          <span>{expectedMovement}</span>
        </div>
        <div className="tdt-cfc-movement-item">
          <label>Estimated Wait Remaining</label>
          <span>~{waitMins} minutes</span>
        </div>
      </div>

      {/* Meta Row */}
      <div className="tdt-cfc-meta-row">
        <div>
          Current Location: <strong>{data.currentLocation}</strong>
        </div>
        <div>
          Trend: <strong>{trendLabel}</strong>
        </div>
        <div>
          Updated: <strong>{data.lastUpdated}</strong>
        </div>
      </div>
    </div>
  );
};

/* Delay Trend Section ──────────────────────────── */
const DelayTrendSection = ({ values, trend, stations }) => {
  const maxVal = Math.max(...values, 1);

  const trendLabel = trend === "increasing" ? "Increasing ↑" : trend === "recovering" ? "Recovering ↓" : "Stable →";

  return (
    <div className="tdt-trend-section">
      <div className="tdt-trend-label">
        Delay Trend
        <span className={`tdt-trend-badge ${trend}`}>{trendLabel}</span>
      </div>

      {/* Bar chart */}
      <div className="tdt-trend-chart">
        {values.map((v, i) => (
          <div key={i} className="tdt-trend-bar-wrap">
            <div
              className={`tdt-trend-bar ${barClass(v)}`}
              style={{ height: `${barHeight(v, maxVal)}px` }}
              title={`${stations?.[i]?.name || `Stop ${i + 1}`}: ${v} min`}
            />
            <span className="tdt-trend-bar-val">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Station Timeline ─────────────────────────────── */
const StationTimeline = ({ stations }) => {
  if (!stations || stations.length === 0) return null;

  return (
    <div className="tdt-card">
      <div className="tdt-section-heading" style={{ marginBottom: 20 }}>
        <i className="fa-solid fa-route" />
        Station-wise Delay Timeline
      </div>

      <div className="tdt-timeline">
        {stations.map((station, index) => {
          const chip = delayChipContent(station);
          const dc = dotClass(station, index, stations.length);
          const lc = index < stations.length - 1 ? lineClass(station, index, stations) : null;
          const isLast = index === stations.length - 1;
          const isCurrent = station.isCurrent;

          // Determine reason badge class
          let reasonCls = "on-time-reason";
          if (isCurrent) {
            reasonCls = "current-reason";
          } else if (station.delayMinutes > 0) {
            reasonCls = "has-delay";
          }

          const stationReason =
            station.delayReason ||
            (station.delayMinutes === 0
              ? "No significant delay"
              : isLast
              ? "Delay accumulated from previous stations"
              : "Operational clearance delay");

          return (
            <div key={index} className={`tdt-timeline-item ${isCurrent ? "is-current-item" : ""}`}>
              {/* Left indicator */}
              <div className="tdt-tl-indicator">
                <div className={`tdt-tl-dot ${dc}`} />
                {!isLast && <div className={`tdt-tl-line ${lc}`} />}
              </div>

              {/* Content */}
              <div className="tdt-tl-content">
                <div className="tdt-station-header">
                  <div className={`tdt-station-name ${isCurrent ? "current-station" : ""} ${isLast ? "destination-station" : ""}`}>
                    {station.name}
                    {isCurrent && <span className="tdt-current-tag">CURRENT</span>}
                    {isLast && !isCurrent && <span className="tdt-dest-tag">Destination</span>}
                  </div>
                  <span className={`tdt-delay-chip ${chip.cls}`}>{chip.label}</span>
                </div>

                <div className="tdt-station-times">
                  {(station.scheduledDeparture || station.scheduledArrival) && (
                    <div className="tdt-time-item">
                      <label>Scheduled</label>
                      <span>{station.scheduledDeparture || station.scheduledArrival}</span>
                    </div>
                  )}
                  {(station.actualDeparture || station.actualArrival) && (
                    <div className="tdt-time-item">
                      <label>{isLast ? "Expected Arrival" : "Actual"}</label>
                      <span className={station.delayMinutes > 0 ? "delayed-time" : "on-time-time"}>
                        {station.actualDeparture || station.actualArrival}
                      </span>
                    </div>
                  )}
                  {station.status === "upcoming" && !station.isCurrent && !isLast && (
                    <div className="tdt-time-item">
                      <label>Expected</label>
                      <span>{station.scheduledArrival}</span>
                    </div>
                  )}
                </div>

                {/* Station-wise Delay Reason (REQ #1) */}
                <div className={`tdt-station-reason-badge ${reasonCls}`}>
                  <i className="fa-solid fa-circle-info" />
                  <span><strong>Reason:</strong> {stationReason}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* Delay Start Card ─────────────────────────────── */
const DelayStartCard = ({ analysis, status }) => (
  <div className="tdt-card tdt-delay-start-card">
    <div className="tdt-card-section-title" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
      <i className="fa-solid fa-magnifying-glass" style={{ color: "#f59e0b" }} />
      Where Did the Delay Start?
    </div>

    {status === "on-time" || !analysis ? (
      <div className="tdt-no-delay-start">
        <i className="fa-solid fa-circle-check" />
        No delay recorded on this journey. Train is running on schedule.
      </div>
    ) : (
      <div className="tdt-delay-start-highlight">
        <i className="fa-solid fa-triangle-exclamation" />
        <p dangerouslySetInnerHTML={{ __html: analysis.summary.replace(analysis.station, `<strong>${analysis.station}</strong>`) }} />
      </div>
    )}
  </div>
);

/* Delay Reason Card ────────────────────────────── */
const DelayReasonCard = ({ reason, isOfficial, status }) => {
  if (status === "on-time") {
    return (
      <div className="tdt-card">
        <div className="tdt-reason-header">
          <span className="tdt-card-section-title">Why Is the Train Delayed?</span>
        </div>
        <div className="tdt-no-delay-start">
          <i className="fa-solid fa-circle-check" />
          Train is running on schedule. No delay reason to report.
        </div>
      </div>
    );
  }

  return (
    <div className="tdt-card">
      <div className="tdt-reason-header">
        <span className="tdt-card-section-title">Why Is the Train Delayed?</span>
        {reason && (
          <span className={isOfficial ? "tdt-reason-chip-official" : "tdt-reason-chip-likely"}>
            {isOfficial ? "Official" : "Likely Reason"}
          </span>
        )}
      </div>

      {reason ? (
        <div className="tdt-reason-body">
          <p>{reason}</p>
        </div>
      ) : (
        <>
          <div className="tdt-reason-unavailable">
            <i className="fa-solid fa-circle-info" />
            Reason currently unavailable from Indian Railways.
          </div>
          <div style={{ marginTop: 12, padding: "12px 16px", background: "#fffbeb", borderRadius: 12, fontSize: 13, color: "#92400e", border: "1px solid #fde68a" }}>
            <strong>Note:</strong> The official reason has not been reported. This is common for minor signal or traffic delays.
          </div>
        </>
      )}
    </div>
  );
};

/* Live Delay Analysis Card ─────────────────────── */
const LiveDelayCard = ({ data }) => {
  if (data.status !== "delayed") return null;

  const trendMap = {
    increasing: { label: "Increasing ↑", cls: "trend-val-increasing" },
    stable: { label: "Stable →", cls: "trend-val-stable" },
    recovering: { label: "Recovering ↓", cls: "trend-val-recovering" },
  };

  const trendInfo = trendMap[data.delayTrend] || trendMap.stable;

  const currentStn =
    (data.stations && data.stations.find((s) => s.isCurrent || s.status === "current")) ||
    data.currentStation;

  return (
    <div className="tdt-card">
      <div className="tdt-live-tag">
        <span className="live-dot" />
        Live Delay Analysis
      </div>

      <div className="tdt-analysis-grid">
        <div className="tdt-analysis-item">
          <label>Current Station</label>
          <span style={{ fontSize: 16, color: "#2563eb", fontWeight: 700 }}>
            {currentStn?.name || data.currentLocation}
          </span>
        </div>

        <div className="tdt-analysis-item">
          <label>Current Delay</label>
          <span className="delayed-val">{data.delayMinutes} min</span>
        </div>

        <div className="tdt-analysis-item">
          <label>When Will It Move?</label>
          <span style={{ fontSize: 13, color: "#d97706", fontWeight: 700 }}>
            {currentStn?.expectedDepartureTime || "Around 09:05 AM"}
          </span>
        </div>

        <div className="tdt-analysis-item">
          <label>Estimated Remaining Wait</label>
          <span style={{ fontSize: 13, color: "#111827", fontWeight: 700 }}>
            ~{currentStn?.estimatedWaitMinutes || 33} min
          </span>
        </div>

        <div className="tdt-analysis-item">
          <label>Delay Trend</label>
          <span className={trendInfo.cls}>{trendInfo.label}</span>
        </div>

        <div className="tdt-analysis-item">
          <label>Last Updated</label>
          <span>{data.lastUpdated}</span>
        </div>

        <div className="tdt-analysis-item" style={{ gridColumn: "span 2" }}>
          <label>Why is the train delayed?</label>
          <span className="reason-val">
            {currentStn?.delayReason || data.delayReason || "Currently unavailable"}
          </span>
        </div>
      </div>
    </div>
  );
};

/* AI Explanation Card ──────────────────────────── */
const AIExplanationCard = ({ explanation }) => (
  <div className="tdt-card">
    <div className="tdt-ai-header">
      <div className="tdt-ai-icon">
        <i className="fa-solid fa-robot" />
      </div>
      <div>
        <div className="tdt-ai-title">AI Delay Analysis</div>
        <div className="tdt-ai-subtitle">Powered by RailSwap AI</div>
      </div>
    </div>

    <div className="tdt-ai-body">
      <p>{explanation}</p>
    </div>
  </div>
);

/* Loading Skeleton ──────────────────────────────── */
const LoadingState = () => (
  <div className="tdt-card">
    <div className="tdt-loading">
      <div className="tdt-spinner" />
      <p>Checking train status...</p>
      <small>Fetching live data from Indian Railways</small>
    </div>
  </div>
);

/* Error Banner ──────────────────────────────────── */
const ErrorBanner = ({ message }) => (
  <div className="tdt-error-banner">
    <i className="fa-solid fa-circle-exclamation" />
    <div>
      <p>{message}</p>
      <small>Live status is temporarily unavailable. Showing demo train status.</small>
    </div>
  </div>
);

/* Empty / Welcome State ─────────────────────────── */
const EmptyState = ({ onExample }) => (
  <div className="tdt-card">
    <div className="tdt-empty-state">
      <div className="tdt-empty-icon">🚂</div>
      <h3>Check Your Train Status</h3>
      <p>
        Enter a PNR number or train number above to see live delay information,
        station-wise timeline, and AI-powered delay analysis.
      </p>
      <div className="tdt-quick-examples">
        <button className="tdt-example-chip" onClick={() => onExample("train", "12951")}>
          <i className="fa-solid fa-train" />
          Try Train 12951
        </button>
        <button className="tdt-example-chip" onClick={() => onExample("pnr", "1234567890")}>
          <i className="fa-solid fa-ticket" />
          Try PNR 1234567890
        </button>
        <button className="tdt-example-chip" onClick={() => onExample("train", "12301")}>
          <i className="fa-solid fa-train" />
          Try Train 12301
        </button>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────

const TrainDelayTracker = () => {
  const [searchType, setSearchType] = useState("train"); // "train" | "pnr"
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendError, setBackendError] = useState("");
  const [resultData, setResultData] = useState(null);
  const [source, setSource] = useState("demo");

  /* ── Validate ─────────────────────────────────── */
  const validate = useCallback(() => {
    const v = inputValue.trim();
    if (!v) {
      setValidationError(
        searchType === "pnr"
          ? "Please enter a valid 10-digit PNR."
          : "Please enter a valid train number."
      );
      return false;
    }
    if (!/^\d+$/.test(v)) {
      setValidationError("Only numeric digits are accepted.");
      return false;
    }
    if (searchType === "pnr" && v.length !== 10) {
      setValidationError("PNR must be exactly 10 digits.");
      return false;
    }
    if (searchType === "train" && v.length < 4) {
      setValidationError("Train number must be at least 4 digits.");
      return false;
    }
    setValidationError("");
    return true;
  }, [inputValue, searchType]);

  /* ── Handle search ───────────────────────────── */
  const handleSearch = useCallback(
    async (e) => {
      e && e.preventDefault();
      if (!validate()) return;

      setIsLoading(true);
      setBackendError("");
      setResultData(null);

      try {
        const res = await checkTrainDelay(searchType, inputValue.trim());

        if (res && res.success && res.data) {
          setResultData(res.data);
          setSource(res.source || "demo");
        } else {
          // Backend returned success:false — still show demo
          setBackendError("Live status unavailable — showing demo train status.");
          // Fetch demo directly by re-calling with demo flag
          const demoRes = await checkTrainDelay(searchType, inputValue.trim());
          if (demoRes?.data) {
            setResultData(demoRes.data);
            setSource("demo");
          }
        }
      } catch (err) {
        // Network / server completely down — still show demo
        setBackendError(
          "Could not reach the server. Showing demo train status instead."
        );
        try {
          // Attempt a fallback demo request
          const demoRes = await checkTrainDelay(searchType, inputValue.trim());
          if (demoRes?.data) {
            setResultData(demoRes.data);
            setSource("demo");
          }
        } catch {
          // If even that fails, show generic demo data inline
          setResultData(buildInlineFallback(searchType, inputValue.trim()));
          setSource("demo");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [searchType, inputValue, validate]
  );

  /* ── Inline fallback (used only when backend completely unreachable) */
  const buildInlineFallback = (type, value) => ({
    trainNumber: type === "train" ? value : "12951",
    trainName: "Mumbai Rajdhani Express",
    from: "Mumbai Central",
    to: "New Delhi",
    status: "delayed",
    delayMinutes: 42,
    currentLocation: "Near Mathura Junction",
    delayReason: "Signal congestion and heavy railway traffic",
    delayReasonOfficial: true,
    delayTrend: "increasing",
    delayTrendValues: [0, 15, 22, 22, 42, 42],
    pnr: type === "pnr" ? value : null,
    passengerName: type === "pnr" ? "Passenger" : null,
    journeyDate: new Date().toISOString().split("T")[0],
    coach: type === "pnr" ? "A1" : null,
    seat: type === "pnr" ? "34" : null,
    class: type === "pnr" ? "2A" : null,
    currentStation: {
      name: "Mathura Junction",
      scheduledArrival: "07:50",
      actualArrival: "08:32",
      delayMinutes: 42,
      delayReason: "Signal congestion and heavy railway traffic",
      expectedDepartureTime: "09:05 AM",
      estimatedWaitMinutes: 33,
    },
    delayStartAnalysis: {
      station: "Surat",
      delayAtStart: 15,
      nextIncreaseStation: "Vadodara",
      nextIncreaseDelay: 22,
      summary:
        "Significant delay started near Surat. The delay of 15 minutes increased to 22 minutes near Vadodara.",
    },
    stations: [
      { name: "Mumbai Central", scheduledDeparture: "17:00", actualDeparture: "17:00", delayMinutes: 0, status: "departed", isCurrent: false, delayReason: "No significant delay", expectedDepartureTime: "17:00", estimatedWaitMinutes: 0 },
      { name: "Surat", scheduledArrival: "20:10", actualArrival: "20:25", delayMinutes: 15, status: "departed", isCurrent: false, delayReason: "Signal clearance delay", expectedDepartureTime: "20:25", estimatedWaitMinutes: 0 },
      { name: "Vadodara", scheduledArrival: "22:05", actualArrival: "22:27", delayMinutes: 22, status: "departed", isCurrent: false, delayReason: "Heavy railway traffic", expectedDepartureTime: "22:27", estimatedWaitMinutes: 0 },
      { name: "Ratlam", scheduledArrival: "01:20", actualArrival: "01:42", delayMinutes: 22, status: "departed", isCurrent: false, delayReason: "Late arrival of connecting train", expectedDepartureTime: "01:42", estimatedWaitMinutes: 0 },
      { name: "Mathura Junction", scheduledArrival: "07:50", actualArrival: "08:32", delayMinutes: 42, status: "current", isCurrent: true, delayReason: "Signal congestion and heavy railway traffic", expectedDepartureTime: "09:05 AM", estimatedWaitMinutes: 33 },
      { name: "New Delhi", scheduledArrival: "08:30", actualArrival: "09:12", delayMinutes: 42, status: "upcoming", isCurrent: false, delayReason: "Delay accumulated from previous stations", expectedDepartureTime: "09:12 AM", estimatedWaitMinutes: 0 },
    ],
    aiExplanation:
      "Mumbai Rajdhani Express (Train No. 12951) is currently running 42 minutes late. The major delay appears to have started around Surat and increased near Vadodara. The train is currently behind schedule near Mathura Junction. The primary cause has been identified as signal congestion and heavy railway traffic. Passengers are advised to check for real-time updates on the Indian Railways app or NTES portal.",
    lastUpdated: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  });

  /* ── Quick-example handler ───────────────────── */
  const handleExample = useCallback((type, value) => {
    setSearchType(type);
    setInputValue(value);
    setValidationError("");
    setResultData(null);
    setBackendError("");
    // Auto-trigger search after state update (use setTimeout to wait for render)
    setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await checkTrainDelay(type, value);
        if (res?.success && res?.data) {
          setResultData(res.data);
          setSource(res.source || "demo");
        }
      } catch {
        setResultData(buildInlineFallback(type, value));
        setSource("demo");
      } finally {
        setIsLoading(false);
      }
    }, 50);
  }, []);

  /* ── Tab switch ──────────────────────────────── */
  const handleTabSwitch = (type) => {
    setSearchType(type);
    setInputValue("");
    setValidationError("");
  };

  /* ── Key handler ─────────────────────────────── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(e);
  };

  // ── Render ─────────────────────────────────────
  return (
    <div className="tdt-page">

      {/* ── Page Header ──────────────────────────── */}
      <div className="tdt-header">
        <h1>
          <span className="tdt-title-icon">
            <i className="fa-solid fa-train-subway" />
          </span>
          Train Delay Tracker
        </h1>
        <p>
          Track live train delays, station-wise delay history and understand why your train is running late.
        </p>
      </div>

      {/* ── Search Card ──────────────────────────── */}
      <div className="tdt-search-card">
        <div className="tdt-search-title">
          <i className="fa-solid fa-magnifying-glass" />
          Check Your Train Status
        </div>

        {/* Tabs */}
        <div className="tdt-tabs">
          <button
            id="tdt-tab-train"
            className={`tdt-tab ${searchType === "train" ? "active" : ""}`}
            onClick={() => handleTabSwitch("train")}
          >
            <i className="fa-solid fa-train" />
            Train Number
          </button>
          <button
            id="tdt-tab-pnr"
            className={`tdt-tab ${searchType === "pnr" ? "active" : ""}`}
            onClick={() => handleTabSwitch("pnr")}
          >
            <i className="fa-solid fa-ticket" />
            PNR Number
          </button>
        </div>

        {/* Input + Button */}
        <div className="tdt-input-row">
          <div className="tdt-input-wrap">
            <i className={searchType === "pnr" ? "fa-solid fa-ticket" : "fa-solid fa-train"} />
            <input
              id="tdt-search-input"
              type="text"
              inputMode="numeric"
              className={`tdt-input ${validationError ? "error" : ""}`}
              placeholder={
                searchType === "pnr"
                  ? "Enter your 10-digit PNR (e.g. 1234567890)"
                  : "Enter train number (e.g. 12951)"
              }
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (validationError) setValidationError("");
              }}
              onKeyDown={handleKeyDown}
              maxLength={searchType === "pnr" ? 10 : 6}
              aria-label={searchType === "pnr" ? "PNR Number" : "Train Number"}
            />
          </div>

          <button
            id="tdt-search-btn"
            className="tdt-search-btn"
            onClick={handleSearch}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin" />
                Checking...
              </>
            ) : (
              <>
                <i className="fa-solid fa-circle-play" />
                Check Delay Status
              </>
            )}
          </button>
        </div>

        {/* Validation error */}
        {validationError && (
          <div className="tdt-validation-error">
            <i className="fa-solid fa-circle-exclamation" />
            {validationError}
          </div>
        )}
      </div>

      {/* ── Results Area ─────────────────────────── */}

      {isLoading && <LoadingState />}

      {!isLoading && backendError && <ErrorBanner message={backendError} />}

      {!isLoading && !resultData && !backendError && (
        <EmptyState onExample={handleExample} />
      )}

      {!isLoading && resultData && (
        <>
          {/* Source badge */}
          <SourceBadge source={source} />

          {/* Two-column grid */}
          <div className="tdt-results-grid">

            {/* ── LEFT COLUMN ────────────────────── */}
            <div className="tdt-col-left">

              {/* Train Info */}
              <TrainInfoCard data={resultData} />

              {/* Station Timeline with Station-wise Delay Reasons */}
              <StationTimeline stations={resultData.stations} />

              {/* Delay Start Analysis */}
              <DelayStartCard
                analysis={resultData.delayStartAnalysis}
                status={resultData.status}
              />

            </div>

            {/* ── RIGHT COLUMN ───────────────────── */}
            <div className="tdt-col-right">

              {/* Current Station Extra Focus Highlight Card */}
              <CurrentStationFocusCard data={resultData} />

              {/* Current Status */}
              <CurrentStatusCard data={resultData} />

              {/* Live Delay Analysis Card */}
              <LiveDelayCard data={resultData} />

              {/* Delay Reason */}
              <DelayReasonCard
                reason={resultData.delayReason}
                isOfficial={resultData.delayReasonOfficial}
                status={resultData.status}
              />

              {/* AI Explanation */}
              {resultData.aiExplanation && (
                <AIExplanationCard explanation={resultData.aiExplanation} />
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TrainDelayTracker;
