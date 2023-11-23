const chords = `
C
Old San Francisco, San Francisco B.C.
I lived with my true love and she lived with me.
G
"Romance is the douche of the bourgeoisie"
Was the very first thing she imparted to me
We had sarcastic hair, we used lewd pseudonyms
                                            C
We got a lot of stares on the street back then.
 
C
Since her dad, a local barber, had been beaten to death
She had become a vocal martyr in the vegan press
G
The cops had failed, they couldn't catch a bus
They were looking for a male with a bad hair cut
Enter tumbleweed, exit love and our affaire d'amour
                       C
Was set on self-destruct.
 
 
C
She said "you don't make enough to provide for me."
I said "what about the stuff that we quote believe?"
G
She said "I left that on the sands of history
I've found a new man to take care of me
He dresses for success and emergency
                                        C
and he moves a lot of concrete on the QVC."
 
Instrumental part: Dm, C
 
C
Middleaged and deadly, like a cobra in the shade
Sat in the midst of the smoke that he made
G
His name was Mr. Games and he owned the place
It was a lonely bar and grill in the Lower Haight
He had a jeweler's hands and a blurry face
                                            C
He knew I needed a chance so he gave me a break.
 
C
"If I hire you now, can you start today?
I got a high-rise job down by the bay.
G
Just a couple of rocks and some firearms
There's not many locks and just one alarm
My step-son Gene will pick you up and drive
                                           C
Try to be his friend, he's got a friendly side."
 
C
Doll-house lightning and the next thing I knew
We were back at our point of rendezvous.
G
I was in the possession of burglary tools
Children's fur coats and diamonds and jewels
Gene's talking about insignificant shit
                                                  C
Just like crooks in the movies when they do that bit.
 
instrumental again: Dm, C
 
C
He said the power of metal will never be harnessed.
I thought the wages of metal should be heavily garnished.
G
We were waiting for his dad to meet us there
Gene took off his hat and I noticed his hair
It was neatly trimmed but a patch was bare
                                           C
I knew it wasn't new wave, it was human error.
 
C
Before I knew what I said, I said "killer cut."
I watched him silently putting out a cigarette butt.
G
Then he came at me with some fist cuisine
I had to duck aside and that was bad for Gene
Cause when he went by me he tripped and fell
                                              C
Through the glass coffee table at the Wong hotel.
 
C
Right there and then Mr. Games walked in
With my ex-true love on his gamy limb.
G
So her dad's killer's dad was her new beau
And Games had a wife, whatta you know?
She got real real quiet till we chucked the kid
                                  C
Then she went her way and I went his.
 
C
Old San Francisco, San Francisco B.C. 
X
`

const songs = [
    {
        tabName: "Silver Jews - SAN FRANCISO B C CHORDS",
        tabContent: chords
    },
    {
        tabName: "Test Artist - TEST CHORDS",
        tabContent: "chords"
    },
    {
        tabName: "Test Artist - TEST CHORDS ver 2",
        tabContent: "chords v2"
    },
    {
        tabName: "King Gizzard and the Lizard Wizard - ROBOT STOP",
        tabContent: "tabtabtabtab"
    },
]

const songsToExport = process.env["NODE_ENV"] === "development"
    ? songs
    : []

export default songsToExport
