import { Link } from 'react-router-dom';
import { WaveDivider } from '../components/Marks';
import { Button } from '../components/ui';

/** Real 404 page. Served with an actual 404 status by Netlify (dist/404.html),
 *  and rendered client-side for any unknown in-app path — no more soft-404s
 *  where garbage URLs returned the homepage with a 200. */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.3em] text-aizuri-deep">道に迷いました</p>
      <h1 className="mt-2 font-display text-4xl text-sumi">This page isn't on the map</h1>
      <p className="mx-auto mt-4 max-w-md leading-relaxed text-sumi-soft">
        Like a traveler who missed a station, you've wandered off the road.
        The link may be old, or the address mistyped — but the catalogue is all still here.
      </p>
      <WaveDivider className="my-8 text-aizuri" />
      <div className="flex flex-wrap justify-center gap-3">
        <Button variant="primary" to="/shop">Browse the shop</Button>
        <Button variant="outline" to="/search">Search the catalogue</Button>
        <Button variant="ghost" to="/">Back to the start</Button>
      </div>
    </div>
  );
}
