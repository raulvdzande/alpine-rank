"use client";

import { useState } from "react";
import Link from "next/link";

const METRICS = ["terrain", "snow", "lifts", "apres", "family", "value", "scenery"] as const;
type Metric = typeof METRICS[number];

const METRIC_LABELS: Record<Metric, string> = {
	terrain: "Terrain",
	snow:    "Snow Quality",
	lifts:   "Lifts",
	apres:   "Après-Ski",
	family:  "Family",
	value:   "Value",
	scenery: "Scenery",
};

const METRIC_ICONS: Record<Metric, string> = {
	terrain: "◈",
	snow:    "❄",
	lifts:   "⟁",
	apres:   "◉",
	family:  "⬡",
	value:   "◇",
	scenery: "△",
};

interface Props {
	action: (fd: FormData) => Promise<void>;
	resortId: string;
	currentUser: { id: string; name: string } | null;
}

export default function RatingForm({ action, resortId, currentUser }: Props) {
	const [values, setValues] = useState<Record<Metric, number>>({
		terrain: 5,
		snow: 5,
		lifts: 5,
		apres: 5,
		family: 5,
		value: 5,
		scenery: 5,
	});

	if (!currentUser) {
		return (
			<div className="rf-guest">
				<div className="rf-guest-title">Sign in required</div>
				<p className="rf-guest-copy">You need an account before you can submit a rating.</p>
				<Link href={`/login?error=${encodeURIComponent("Please sign in to submit a review")}`} className="rf-guest-link">
					Go to login
				</Link>
			</div>
		);
	}

	return (
		<form action={action} className="rf-form">
			<input type="hidden" name="resortId" value={resortId} />

			<div className="rf-sliders">
				{METRICS.map((key, i) => (
					<div key={key} className="rf-row" style={{ animationDelay: `${0.05 * i}s` }}>
						<div className="rf-row-head">
							<span className="rf-icon">{METRIC_ICONS[key]}</span>
							<label className="rf-label" htmlFor={`rf-${key}`}>
								{METRIC_LABELS[key]}
							</label>
							<output className="rf-output" id={`out-${key}`}>{values[key].toFixed(1)}</output>
						</div>
						<div className="rf-track-wrap">
							<input
								id={`rf-${key}`}
								name={key}
								type="range"
								min="1"
								max="10"
								step="0.5"
								value={values[key]}
								onChange={(event) => {
									const nextValue = Number(event.currentTarget.value);
									setValues((currentValues) => ({ ...currentValues, [key]: nextValue }));
									event.currentTarget.style.setProperty("--val", `${((nextValue - 1) / 9) * 100}%`);
								}}
								className="rf-slider"
								style={{ ["--val" as string]: `${((values[key] - 1) / 9) * 100}%` }}
							/>
							<div className="rf-track-fill" />
						</div>
					</div>
				))}
			</div>

			<button type="submit" className="rf-submit">
				<span className="rf-submit-text">Submit Rating</span>
				<span className="rf-submit-arrow">→</span>
			</button>
		</form>
	);
}
