class ShapeRecognizer {
  getBounds(points) {
    const xs = points.map((p) => p.x);
    const ys = points.map((p) => p.y);

    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      width: Math.max(...xs) - Math.min(...xs),
      height: Math.max(...ys) - Math.min(...ys),
    };
  }

  distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  pathLength(points) {
    let length = 0;

    for (let i = 1; i < points.length; i++) {
      length += this.distance(points[i - 1], points[i]);
    }

    return length;
  }

  simplify(points, tolerance = 12) {
    if (points.length <= 2) return points;

    const simplified = [points[0]];
    let last = points[0];

    for (let i = 1; i < points.length; i++) {
      if (this.distance(last, points[i]) >= tolerance) {
        simplified.push(points[i]);
        last = points[i];
      }
    }

    simplified.push(points[points.length - 1]);
    return simplified;
  }

  countCorners(points) {
    const simplified = this.simplify(points, 14);
    let corners = 0;

    for (let i = 1; i < simplified.length - 1; i++) {
      const a = simplified[i - 1];
      const b = simplified[i];
      const c = simplified[i + 1];

      const angle1 = Math.atan2(b.y - a.y, b.x - a.x);
      const angle2 = Math.atan2(c.y - b.y, c.x - b.x);

      let diff = Math.abs(angle2 - angle1);
      diff = Math.min(diff, Math.PI * 2 - diff);

      // sharp turn
      if (diff > 0.75) {
        corners++;
      }
    }

    return corners;
  }

  recognize(points) {
    if (!points || points.length < 12) return "freehand";

    const first = points[0];
    const last = points[points.length - 1];
    const bounds = this.getBounds(points);

    const width = bounds.width;
    const height = bounds.height;

    if (width < 20 || height < 20) return "freehand";

    const endDistance = this.distance(first, last);
    const totalLength = this.pathLength(points);
    const directDistance = this.distance(first, last);

    const maxSide = Math.max(width, height);
    const closed = endDistance < maxSide * 0.45;
    const straightness = directDistance / totalLength;

    if (!closed && straightness > 0.65) {
      return "line";
    }

    if (closed) {
      const corners = this.countCorners(points);
      const ratio = width / height;

      console.log("Corners:", corners);

      if (corners >= 3 && corners <= 6) {
        if (ratio > 0.75 && ratio < 1.25) {
          return "square";
        }

        return "rectangle";
      }

      if (ratio > 0.65 && ratio < 1.45) {
        return "circle";
      }

      return "ellipse";
    }

    return "freehand";
  }
}

export default new ShapeRecognizer();