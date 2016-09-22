# MoveOver

MoveOver is a [Canva](https://www.canva.com) style landing page.

With extra goodness:

* Extended browser support (Firefox: more on it later)
* Responsive, i.e., almost all sized screens
* Mobile (single touch) support

---

### But Why?

![But Why?](but-why.gif)

The blur-unblur effect on [Canva](https://www.canva.com) is one of my personal favorites. But there's a hiccup. If you visit the website on FIrefox, you might land on their [alternate version](https://www.canva.com/?pageVariant=template).

But Why?

If you look at the url, it goes something like
`https://www.canva.com/?pageVariant=template&utm_expid=...`
By removing the part `pageVariant=template&`, the default page is loaded.

As of the time of posting, the trails are all "sharp".

But why?

Because webkit and gecko handle blurs differently. And the difference is made visible when different [`composite operations`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation) are mixed together.

Long story short, by
[saving](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/save)
/
[restoring](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/restore)
canvas context around paint operations, the problem can be circumvented.

### Demo

The [demo](https://zhirzh.github.io/moveover/dist) uses the technique mentioned above.
