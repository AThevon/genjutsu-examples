import type { CSSProperties } from "react";

/* The one motion (interaction thesis): matched rows recede in order, the mismatch stays.
   --i is the row's place in the stagger; the held row goes last. CSS only, see index.css. */
const order = (i: number) => ({ "--i": i }) as CSSProperties;

export default function MatchTable() {
  return (
    <figure className="match">
      <div className="match__scroll" role="region" aria-label="Example three-way match" tabIndex={0}>
        <table className="match__table">
          <caption className="match__caption">
            One supplier invoice, matched line by line against the purchase order and the delivery
            note. Illustrative example, not customer data.
          </caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col" className="num">Invoiced</th>
              <th scope="col" className="num">Ordered</th>
              <th scope="col" className="num">Delivered</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="match__row match__row--matched" style={order(0)}>
              <th scope="row">Olive oil, tins</th>
              <td className="num">40</td>
              <td className="num">40</td>
              <td className="num">40</td>
              <td><span className="match__status">Matched</span></td>
            </tr>
            <tr className="match__row match__row--matched" style={order(1)}>
              <th scope="row">Canned tomatoes</th>
              <td className="num">12</td>
              <td className="num">12</td>
              <td className="num">12</td>
              <td><span className="match__status">Matched</span></td>
            </tr>
            <tr className="match__row match__row--held" style={order(4)}>
              <th scope="row">Basmati rice, sacks</th>
              <td className="num match__diff">24</td>
              <td className="num">24</td>
              <td className="num match__diff">20</td>
              <td><span className="match__status match__status--held">Held: 4 not delivered</span></td>
            </tr>
            <tr className="match__row match__row--matched" style={order(2)}>
              <th scope="row">Paper napkins, cases</th>
              <td className="num">60</td>
              <td className="num">60</td>
              <td className="num">60</td>
              <td><span className="match__status">Matched</span></td>
            </tr>
            <tr className="match__row match__row--matched" style={order(3)}>
              <th scope="row">Espresso cups, boxes</th>
              <td className="num">8</td>
              <td className="num">8</td>
              <td className="num">8</td>
              <td><span className="match__status">Matched</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </figure>
  );
}
