# WebRTC demo

In this project I demonstrate how to setup a WebRTC connection between two browers.

In order to make this work you also need a signal server, e.g. the one I've
made here: https://github.com/sce/local-signal .

# Setup

    $ npm install
    $ npm run devstart

`devstart` will restart the server when you change any files, so you just need
to refresh the browser to see the effect.

## Signal Server

WebRTC requires a medium (a *signal channel*) where clients can exchange
information (e.g. about how they can setup a connection between each other)
*before* a WebRTC connection can be made.

I've written a proof-of-concept signal server in Ruby that can be used with this demo.

    $ git clone https://github.com/sce/local-signal.git
    $ cd local-signal

    # Follow setup procedures in that project, but it's probably just:

    $ bundle
    $ ./local-signal.rb

# Using

Go to `http://localhost:3000/client` in one tab and
`http://localhost:3000/server` in another and watch the magic unfold (maybe).

# About

Written by Sten Christoffer Eliesen.

The code is just a demo / proof of concept and is quite buggy as of writing.
Specifically you need to refresh the server and/or client a couple of times
before they actually connect.

## License

    ISC License
    Copyright (c) 2016, Sten Christoffer Eliesen.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted, provided that the above
    copyright notice and this permission notice appear in all copies.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
    FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
