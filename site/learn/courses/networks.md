---
id: networks
title: Computer Networks
icon: 🌍
track: Computer Science
color: #0E6655
runner: none
tagline: How data travels from your browser to a server and back.
description: The university computer-networks course, taught for interviews and practical troubleshooting: OSI and TCP/IP models, physical and data link layers, IP addressing and subnetting, routing, TCP vs UDP, DNS, HTTP/HTTPS and TLS, email protocols, NAT and firewalls, wireless, network security, VPNs, CDNs, performance, and command-line diagnostics.
---

# LEVEL: Beginner

## What a network is and the types you will meet

A **computer network** is two or more devices connected so they can exchange data. The devices are called **hosts** (your laptop, a phone, a server in Virginia) and the things that join them are **links** (a copper cable, a fibre strand, a Wi-Fi radio channel). Everything else in this course is about how bits get from one host to another reliably, quickly and safely.

The simplest network is two laptops joined by one Ethernet cable. The biggest is the internet, which is not one network at all but tens of thousands of separate networks that agreed to talk to each other using the same rules. Those rules are called **protocols**.

### Networks by size

| Type | Stands for | Typical reach | Example |
|---|---|---|---|
| **PAN** | Personal Area Network | A few metres | Phone to Bluetooth headset |
| **LAN** | Local Area Network | One building or floor | The Systems Limited production floor: 20 agent PCs, one switch, one printer |
| **WLAN** | Wireless LAN | One building | The same floor over Wi-Fi |
| **MAN** | Metropolitan Area Network | One city | A university with three campuses in Lahore linked by fibre |
| **WAN** | Wide Area Network | Countries | A BPO office in Lahore connected to a client's data centre in Texas |
| **Internet** | Network of networks | The planet | Everything above, interconnected |

A LAN is fast (1 Gbps per port is normal) and cheap because you own the cables. A WAN is slower and expensive because somebody else owns the long-distance links and you rent capacity on them. This is why a title-search team in Lahore downloads document images overnight in bulk instead of one at a time during the shift: the WAN link, not the agents, is the bottleneck.

### Clients and servers

Most traffic follows the **client-server** pattern. A client asks; a server answers.

```text
Agent PC (client)  --->  "GET /images/deed-2024-00123.pdf"  --->  Document server
Agent PC (client)  <---  200 OK + 1.8 MB of PDF bytes          <---  Document server
```

The server is not a special kind of machine. It is any host running a program that waits for requests. Your laptop becomes a server the moment you run `python -m http.server`. The alternative pattern is **peer-to-peer**, where every host is both client and server (BitTorrent, some video calls).

### What travels: packets

Data is not sent as one long stream of bits. It is chopped into **packets**, each carrying a slice of the data plus addressing information in a **header**. A 1.8 MB PDF becomes roughly 1,300 packets of about 1,500 bytes each. Packets can take different routes and arrive out of order; the receiver reassembles them. This design, called **packet switching**, is why the internet survives a cut cable: packets simply route around it.

```bash
# See the packets your own machine is sending right now (Linux/macOS)
ip -s link          # Linux: packet and byte counters per interface
netstat -e          # Windows: bytes and packets sent/received
```

The alternative, **circuit switching**, reserved a dedicated path for the whole call. Old telephone networks worked this way. It guarantees capacity but wastes it when nobody is talking.

### The three questions every layer answers

When you look at any network technology, ask:

1. **Addressing** — how does a packet say where it is going? (MAC address, IP address, port number)
2. **Delivery** — how does it get there? (switching, routing)
3. **Reliability** — what happens when it is lost? (retransmission, or nothing)

> **Tip:** Interviewers love the "what happens when you type a URL and press Enter" question. Every chapter in this course adds one step to that answer. By the Expert level you will be able to talk for ten minutes on it, which is exactly what they want.

### Bandwidth versus latency

Two numbers describe a link. **Bandwidth** is how many bits per second it can carry (a 100 Mbps fibre line). **Latency** is how long one bit takes to cross it (Lahore to Dallas is about 230 ms round trip). A bigger pipe does not make the water arrive sooner; it only lets more arrive at once. Keep the two separate in your head now, and the Expert chapter on performance will make much more sense.

### Try It Yourself

```bash
# Discover your own place in the network
hostname                # this machine's name
ip addr show            # Linux: your IP addresses (Windows: ipconfig /all)
ip route show           # where packets leave your LAN (Windows: route print)
ping -c 4 1.1.1.1       # can you reach the internet? (Windows: ping 1.1.1.1)
```

### Quiz

1. Which network type covers a single office floor?
- [x] LAN
- [ ] WAN
- [ ] MAN
> A Local Area Network is confined to one building or floor and is usually owned by one organisation.

2. Why is data split into packets?
- [ ] To make it encrypted
- [x] So it can be routed independently and reassembled, surviving link failures
- [ ] Because cables can only carry 1,500 bytes in total
> Packet switching lets each packet take any available path; the receiver reassembles them.

3. A 1 Gbps link between Lahore and Texas has high bandwidth. What does it NOT improve?
- [ ] The number of files you can transfer per hour
- [x] The time for a single small request to get a reply
- [ ] The number of agents who can download at once
> Latency depends on distance and the speed of light in fibre, not on the pipe's width.

### Exercises

1. **Classify the network** — A title company has an office in Cheyenne with 12 PCs on one switch, a VPN to its underwriter in Houston, and agents working from home over Wi-Fi. Name the network type for each of the three connections.
<details><summary>Solution</summary>

```text
12 PCs on one switch            -> LAN
VPN from Cheyenne to Houston    -> WAN (an encrypted tunnel over the internet)
Home agents over Wi-Fi          -> WLAN at home, then WAN/internet to the office
```

</details>

2. **Count the packets** — A 3 MB scanned mortgage image is sent in packets carrying 1,460 bytes of data each. Roughly how many packets is that?
<details><summary>Solution</summary>

```text
3 MB = 3 * 1,048,576 = 3,145,728 bytes
3,145,728 / 1,460 = 2,154.6  ->  about 2,155 packets
```

</details>

### Interview Questions

**Q: What is the difference between the internet and the World Wide Web?**
The internet is the physical and logical infrastructure: hosts, routers, links and the IP protocol that lets any host reach any other. The web is one application that runs on top of it, using HTTP to move HTML pages and other resources between browsers and servers. Email, SSH, video calls and online games all use the internet without being part of the web. A good candidate adds that the web arrived in 1991, about two decades after the first internet links, and that "the internet is down" usually means either DNS or the local gateway failed, not the whole thing.

**Q: Explain packet switching versus circuit switching and why the internet chose packet switching.**
Circuit switching reserves a fixed path with fixed capacity for the duration of a conversation, as in the classic telephone network; it guarantees quality but wastes capacity whenever the parties pause. Packet switching breaks data into independently addressed packets that share links with everyone else's packets, so the link is fully used and the network keeps working if a router fails, because packets route around it. The cost is variable delay and possible loss, which higher layers such as TCP fix by retransmitting. The internet chose packet switching for robustness and efficiency; the trade-off shows up as jitter on video calls, which is why VoIP uses UDP and buffers.

**Q: What is the difference between bandwidth and latency, and which matters more for a remote desktop session?**
Bandwidth is capacity in bits per second; latency is the one-way or round-trip delay for a single bit. A remote desktop session sends small screen updates and keystrokes constantly, so it is dominated by latency: at 230 ms round trip from Lahore to Texas every click feels sluggish no matter how much bandwidth you buy. Bulk file transfer is the opposite and scales with bandwidth. In practice I check both with `ping` for latency and a large download or `iperf3` for throughput, and I would place the RDP jump host in the same region as the data to keep the latency-sensitive hop short.

## The OSI model

The **OSI model** (Open Systems Interconnection, standardised by ISO in 1984) is a seven-layer way of describing what a network has to do. Real software does not follow it exactly, but every interview, every certification and every troubleshooting conversation uses its vocabulary, so learn the layers by number and by name.

| # | Layer | Unit of data | Job | Examples |
|---|---|---|---|---|
| 7 | Application | Data | What the user's program wants | HTTP, DNS, SMTP, FTP, SSH |
| 6 | Presentation | Data | Format, encode, encrypt | TLS, JPEG, UTF-8, gzip |
| 5 | Session | Data | Open, manage, close dialogues | RPC, NetBIOS, the TLS handshake in practice |
| 4 | Transport | Segment (TCP) / Datagram (UDP) | End-to-end delivery between programs | TCP, UDP, port numbers |
| 3 | Network | Packet | Delivery between hosts across networks | IP, ICMP, routers |
| 2 | Data Link | Frame | Delivery between neighbours on one link | Ethernet, Wi-Fi, MAC addresses, switches |
| 1 | Physical | Bit | Electrical, optical or radio signals | Cables, connectors, hubs, radio |

A memory aid from the top down: **A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing. From the bottom up: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.

### Each layer talks to the same layer on the other side

The key idea is that layer 4 on your laptop behaves as if it were talking directly to layer 4 on the server, even though the data actually travels down to layer 1, across the wire, and back up. Each layer adds its own header on the way down and removes it on the way up. That wrapping is called **encapsulation** and the next chapter shows it byte by byte.

```text
Your PC                                   Server
[7] HTTP  "GET /report.pdf"    <------>   [7] HTTP
[4] TCP   port 51234 -> 443    <------>   [4] TCP
[3] IP    10.0.0.5 -> 93.184.216.34 <-->  [3] IP
[2] Eth   MAC of PC -> MAC of router      [2] Eth (different MACs on each hop!)
[1] bits on copper / fibre / radio
```

Notice that the IP addresses stay the same end to end, but the MAC addresses change on every hop, because layer 2 only ever talks to the next device on the same cable.

### Why layering helps

Layering lets each piece be replaced without touching the rest. Swap Wi-Fi for Ethernet and only layers 1 and 2 change; HTTP does not know or care. Move from IPv4 to IPv6 and only layer 3 changes. This is the same reason you separate a Word template's styles from its content: change one without breaking the other.

### Where things go wrong, by layer

Troubleshooting is faster when you name the layer.

```text
Layer 1  Cable unplugged, bad Wi-Fi signal      -> link light off, "no carrier"
Layer 2  Wrong VLAN, switch port disabled       -> connected but nothing answers ARP
Layer 3  Wrong IP, wrong gateway, no route      -> ping to gateway fails
Layer 4  Firewall blocks the port               -> ping works, but port 443 times out
Layer 7  Server misconfigured, wrong URL        -> connection works, HTTP 404 or 500
```

An agent says "the internet is down". You ping the gateway (layer 3 on the LAN): fine. You ping 1.1.1.1: fine. You run `nslookup docs.client.com`: fails. The problem is DNS, a layer 7 service, and the fix is nowhere near the cable.

> **Interview note:** When asked "which layer does X belong to", give the layer and one sentence of reasoning. A switch is layer 2 because it forwards frames by MAC address. A router is layer 3 because it forwards packets by IP address. A load balancer that inspects URLs is layer 7. Saying "why" is worth more than the number.

### Layers 5 and 6 in the real world

Layers 5 and 6 rarely appear as separate software. TLS encryption is usually described as sitting between layers 4 and 7, doing presentation-layer work (encryption) and session-layer work (the handshake and session resumption). When interviewers ask about them, say honestly that the TCP/IP model folds them into the application layer, then give TLS and JPEG as examples.

### Try It Yourself

```bash
# Walk up the layers to find a fault
ip link                     # L1/L2: is the interface UP and does it have a carrier?
ip neigh                    # L2: ARP table, do you see the gateway's MAC?
ping -c 3 $(ip route | awk '/default/ {print $3}')   # L3: reach the gateway
ping -c 3 1.1.1.1           # L3: reach the internet by IP
nslookup example.com        # L7 service: does DNS resolve?
curl -I https://example.com # L4+L7: TCP, TLS and HTTP all at once
```

### Quiz

1. Which layer uses MAC addresses?
- [ ] Network (3)
- [x] Data Link (2)
- [ ] Transport (4)
> MAC addresses identify interfaces on the same physical link; that is layer 2's job.

2. A firewall rule blocks TCP port 3389. At which layer is the block applied?
- [ ] Layer 1
- [ ] Layer 3
- [x] Layer 4
> Port numbers belong to TCP and UDP, which are transport-layer protocols.

3. Which addresses change at every hop across the internet?
- [x] MAC addresses
- [ ] IP addresses
- [ ] Port numbers
> Layer 2 frames are rebuilt on each link, so the source and destination MACs are those of the neighbours.

4. What is the unit of data at the transport layer in TCP?
- [ ] Frame
- [ ] Packet
- [x] Segment
> Bits, frames, packets, segments, data: one name per layer from 1 to 4 and above.

### Exercises

1. **Name the layer** — Assign a layer to each of these: HTTPS certificate, `ping`, Wi-Fi channel 6, TCP port 25, an Ethernet frame's CRC.
<details><summary>Solution</summary>

```text
HTTPS certificate      -> Layer 6 (Presentation) in OSI terms; part of TLS
ping (ICMP echo)       -> Layer 3 (Network); ICMP rides directly on IP
Wi-Fi channel 6        -> Layer 1 (Physical); it is a radio frequency
TCP port 25            -> Layer 4 (Transport)
Ethernet frame CRC     -> Layer 2 (Data Link); error detection on one link
```

</details>

2. **Diagnose by layer** — An agent can open the client's web portal by IP address but not by name. Which layer, and what is the likely fix?
<details><summary>Solution</summary>

```text
Layers 1-4 are proven to work because the site opens by IP.
The failure is name resolution: DNS, an application-layer service.
Fix: check the DNS server in `ipconfig /all`, try `nslookup portal.client.com 8.8.8.8`,
and flush the cache with `ipconfig /flushdns`.
```

</details>

### Interview Questions

**Q: Why do we still teach the OSI model if TCP/IP does not follow it?**
Because it gives everyone the same vocabulary for where a function lives, which is what makes a troubleshooting conversation between a developer, a network engineer and a vendor possible. When I say "the load balancer is layer 7" or "this is a layer 2 problem", the listener immediately knows what tools and logs to look at. TCP/IP's four layers describe what is actually implemented, but they lump session, presentation and application together, which hides useful distinctions such as where TLS sits. In interviews I present both models side by side and note that TCP/IP is what the code does, OSI is how we talk about it.

**Q: A switch and a router both connect devices. What is the layer difference and why does it matter?**
A switch operates at layer 2: it learns which MAC address is on which port and forwards Ethernet frames only to the right port within one LAN or VLAN. A router operates at layer 3: it reads the destination IP, consults a routing table, and forwards packets between different networks, rewriting the layer 2 frame on each hop. The practical consequence is that broadcasts (such as ARP and DHCP discover) stop at a router but flood through a switch, which is why we split large offices into VLANs with a router or layer 3 switch between them. Modern "layer 3 switches" blur the line by routing in hardware, but the conceptual split still explains their behaviour.

**Q: Where does TLS fit in the OSI model?**
Strictly it does presentation-layer work (encrypting and decrypting application data) and session-layer work (the handshake, session tickets and resumption), so textbooks place it at layers 5 and 6. In implementation terms it is a library that sits between the application (HTTP) and the transport (TCP), which is why the TCP/IP model simply calls it part of the application layer. A strong answer mentions that QUIC, used by HTTP/3, folds TLS 1.3 directly into the transport protocol, so the neat layering breaks down further in modern stacks.

## TCP/IP model and encapsulation

The **TCP/IP model** is the four-layer model the internet is actually built on. It predates OSI and is what your operating system's network stack implements. Once you can map OSI to TCP/IP you can read any diagram.

| TCP/IP layer | OSI layers | Protocols | Unit |
|---|---|---|---|
| Application | 7, 6, 5 | HTTP, TLS, DNS, SMTP, SSH | Message |
| Transport | 4 | TCP, UDP | Segment / Datagram |
| Internet | 3 | IP, ICMP, ARP (arguably) | Packet |
| Link (Network Access) | 2, 1 | Ethernet, Wi-Fi, PPP | Frame |

### Encapsulation, byte by byte

When your browser sends `GET /rates.xlsx`, each layer wraps the data from the layer above in its own header. Think of it as putting a letter into an envelope, the envelope into a courier bag, the bag into a truck.

```text
Application:  [HTTP request: GET /rates.xlsx HTTP/1.1 ...]                 (~ 200 bytes)
Transport:    [TCP header 20 B][HTTP request]                               = segment
Internet:     [IP header 20 B][TCP header][HTTP request]                    = packet
Link:         [Eth header 14 B][IP][TCP][HTTP][Eth trailer/CRC 4 B]         = frame
```

The receiver does the reverse, **decapsulation**: the network card strips the Ethernet frame, hands the packet to the IP code, which strips its header and hands the segment to TCP, which strips its header and delivers bytes to the browser or web server.

### What each header carries

- **Ethernet header**: destination MAC, source MAC, EtherType (0x0800 = IPv4, 0x86DD = IPv6, 0x0806 = ARP).
- **IP header**: version, TTL (hop limit), protocol (6 = TCP, 17 = UDP, 1 = ICMP), source IP, destination IP.
- **TCP header**: source port, destination port, sequence number, acknowledgement number, flags (SYN, ACK, FIN, RST), window size.

Each header contains a field that says what the *next* header is. That chain is how a receiver knows how to interpret the bytes: EtherType says "IPv4 follows", IP's protocol field says "TCP follows", TCP's destination port says "this is for the program listening on 443".

### MTU and fragmentation

Ethernet frames carry at most **1,500 bytes** of payload, the **MTU** (Maximum Transmission Unit). Subtract 20 bytes of IP header and 20 of TCP header and you get the **MSS** (Maximum Segment Size) of 1,460 bytes of application data per packet, which is where the number in Chapter 1 came from. VPNs add their own headers, so a VPN tunnel often has an MTU of 1,400 or less; when a large packet cannot fit, IPv4 routers may **fragment** it, and IPv6 routers refuse and send back an ICMP "Packet Too Big". A mis-set MTU is a classic cause of "small pages load, large downloads hang" over a VPN.

```bash
# Find the largest packet that crosses a path without fragmentation (Linux)
ping -M do -s 1472 1.1.1.1     # 1472 data + 8 ICMP + 20 IP = 1500 bytes
ping -M do -s 1400 10.8.0.1    # try a smaller size across a VPN
# Windows equivalent
ping -f -l 1472 1.1.1.1
```

If the 1472 ping says "Frag needed" or "Message too long", something on the path has a smaller MTU.

### Ports: how one IP serves many programs

A host has one IP address but runs many programs. **Port numbers** (0–65535) in the TCP/UDP header tell the receiving OS which program gets the data. Servers listen on well-known ports; clients use a random high port (an **ephemeral port**, typically 49152–65535 on Windows, 32768–60999 on Linux) for each connection.

| Port | Protocol | Service |
|---|---|---|
| 22 | TCP | SSH, SFTP |
| 25 / 587 / 465 | TCP | SMTP (relay / submission / submission over TLS) |
| 53 | UDP and TCP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP (and UDP for HTTP/3) | HTTPS |
| 3389 | TCP | Remote Desktop |

The 4-tuple (source IP, source port, destination IP, destination port) uniquely identifies a connection. That is how one server on port 443 can hold 10,000 simultaneous conversations.

> **Warning:** Ports are a property of TCP and UDP, not of IP. `ping` uses ICMP, which has no ports, so "ping works but the site does not" tells you the IP layer is fine and the problem is at transport or above (a blocked port, a stopped service, a bad certificate).

### Try It Yourself

```bash
# Watch encapsulation happen with tcpdump (Linux/macOS; run as root)
sudo tcpdump -i any -n -c 5 'tcp port 443'
# Sample line, read it left to right: link timestamp, IP src.port > dst.port, TCP flags
# 12:01:05.123 IP 10.0.0.5.51234 > 93.184.216.34.443: Flags [S], seq 1, win 64240, length 0
#
# Show which programs own which ports on this machine
ss -tulpn          # Linux
netstat -ano       # Windows (then match PID in Task Manager)
```

### Quiz

1. In which order are headers added when a packet is sent?
- [ ] Ethernet, IP, TCP, HTTP
- [x] HTTP data first, then TCP, then IP, then Ethernet
- [ ] IP, TCP, Ethernet, HTTP
> Encapsulation wraps from the top layer downwards; the Ethernet frame is the outermost.

2. What does the IP header's protocol field value 17 mean?
- [ ] TCP
- [x] UDP
- [ ] ICMP
> 1 = ICMP, 6 = TCP, 17 = UDP. These numbers appear in firewall logs and Wireshark.

3. Standard Ethernet MTU is 1,500 bytes. What is the usual TCP MSS?
- [ ] 1,500
- [x] 1,460
- [ ] 1,024
> 1,500 minus 20 bytes of IPv4 header minus 20 bytes of TCP header leaves 1,460.

### Exercises

1. **Trace the chain** — Given an Ethernet frame with EtherType 0x0800, an IP protocol field of 6 and a TCP destination port of 22, name each protocol and what the payload probably is.
<details><summary>Solution</summary>

```text
0x0800  -> IPv4 packet inside the frame
6       -> TCP segment inside the IP packet
port 22 -> SSH (or SFTP) data inside the TCP segment
```

</details>

2. **Find the MTU** — Write the sequence of `ping` commands you would use on Windows to discover the largest non-fragmenting payload across a VPN whose gateway is 10.8.0.1.
<details><summary>Solution</summary>

```bash
ping -f -l 1472 10.8.0.1   # fails -> path MTU < 1500
ping -f -l 1400 10.8.0.1   # succeeds
ping -f -l 1430 10.8.0.1   # binary search upwards until it fails
# Largest working payload + 28 = path MTU. Set the VPN adapter MTU to that value.
```

</details>

### Interview Questions

**Q: Walk me through encapsulation when a browser sends an HTTPS request.**
The browser hands an HTTP request to TLS, which encrypts it into records. TLS hands the bytes to TCP, which splits them into segments no larger than the MSS and prepends a 20-byte header with source and destination ports, sequence numbers and flags. IP prepends its header with source and destination addresses, TTL and protocol 6. The link layer wraps the packet in an Ethernet or Wi-Fi frame addressed to the default gateway's MAC, adds a CRC, and the NIC turns it into signals. Every router along the way strips and rebuilds only the frame, decrements the TTL, and leaves the TCP and TLS payload untouched; the destination host unwraps each layer in reverse. I usually add that this is why a packet capture shows the same IP pair on every hop but different MAC pairs.

**Q: What is the difference between MTU and MSS, and when does it bite you?**
MTU is the largest frame payload a link accepts, 1,500 bytes on standard Ethernet; MSS is the largest TCP payload a segment carries, negotiated in the SYN packets and typically MTU minus 40 bytes of IP and TCP headers. It bites you when a tunnel or PPPoE link in the middle has a smaller MTU than the endpoints assume: packets get fragmented, or, if the Don't Fragment bit is set and ICMP is blocked by a firewall, they are silently dropped. The symptom is a "black hole": small requests such as login pages succeed while large responses hang. The fixes are MSS clamping on the router, enabling Path MTU Discovery by allowing ICMP type 3 code 4, or lowering the tunnel interface's MTU.

**Q: How can one server on port 443 talk to thousands of clients at once?**
Because a TCP connection is identified by the full 4-tuple of source IP, source port, destination IP and destination port, not by the server port alone. Each client picks a distinct ephemeral source port, so the server sees thousands of distinct tuples all arriving on its single listening socket and the OS demultiplexes them into separate connection sockets. The real limits are file descriptors, memory per connection and the accept loop's speed, which is why high-traffic servers use event-driven I/O such as epoll and why load balancers spread clients across many backend IPs.

## Physical and data link layer: Ethernet, MAC and switches

The bottom two layers move bits between devices that share a cable or a radio channel. You rarely write code here, but half of all "network down" tickets live here, so you need to recognise the parts.

### Physical media

| Medium | Standard | Speed | Max distance | Notes |
|---|---|---|---|---|
| Twisted-pair copper Cat5e | 1000BASE-T | 1 Gbps | 100 m | The blue cable on every desk |
| Twisted-pair copper Cat6a | 10GBASE-T | 10 Gbps | 100 m | Server rooms |
| Multimode fibre | 10GBASE-SR | 10 Gbps | 300–400 m | Between floors or buildings |
| Single-mode fibre | 10GBASE-LR and beyond | 10–400 Gbps | 10 km+ | Carrier and long-haul links |
| Radio 2.4 / 5 / 6 GHz | Wi-Fi 802.11 | Varies | Tens of metres | Shared medium, half duplex |

Copper uses **RJ45** connectors and eight wires in four twisted pairs; the twisting cancels electrical noise. Fibre carries light and is immune to electrical interference, which is why it links buildings where lightning and ground differences would fry copper.

### MAC addresses

Every network interface has a **MAC address** (Media Access Control), 48 bits written as six hex pairs such as `3C:7C:3F:1A:2B:9D`. The first three pairs identify the manufacturer (the **OUI**; `3C:7C:3F` is ASUSTek), the last three are unique per device. MAC addresses are burned in at the factory but can be overridden in software, and modern phones randomise them per Wi-Fi network for privacy.

```bash
ip link show            # Linux: "link/ether 3c:7c:3f:1a:2b:9d"
ifconfig en0 | grep ether   # macOS
getmac /v                # Windows
```

Special addresses: `FF:FF:FF:FF:FF:FF` is the **broadcast** address, delivered to every host on the LAN.

### Ethernet frames

An Ethernet II frame is: destination MAC (6 bytes), source MAC (6), EtherType (2), payload (46–1,500), FCS (4-byte CRC-32 checksum). The switch reads the first 12 bytes and already knows where to send the frame; it never looks at the IP inside.

```text
| Dst MAC | Src MAC | Type  | Payload (IP packet) ... | FCS  |
|  6 B    |  6 B    | 2 B   | 46 - 1500 B             | 4 B  |
```

If the FCS does not match, the frame is silently dropped. The switch does not ask for a retransmission; that is TCP's problem three layers up.

### Hubs, switches and collision domains

A **hub** (obsolete) repeated every bit to every port, so two hosts sending at once produced a **collision**. Ethernet handled this with **CSMA/CD** (Carrier Sense Multiple Access with Collision Detection): listen before sending, and if a collision is heard, back off a random time and retry.

A **switch** replaces the hub. It keeps a **MAC address table** (also called the CAM table) mapping each MAC to the port it was last seen on.

```text
Switch MAC table (example, learned automatically)
Port 1   3C:7C:3F:1A:2B:9D   (agent PC 01)
Port 2   3C:7C:3F:1A:2C:11   (agent PC 02)
Port 24  00:1A:8C:4F:00:01   (router / default gateway)
```

When a frame arrives, the switch looks up the destination MAC and sends it only to that port. Unknown destinations and broadcasts are **flooded** to all ports. Every port is its own collision domain, and with full-duplex links there are no collisions at all, so CSMA/CD is history on wired networks. Wi-Fi, being a shared radio channel, still uses a cousin called CSMA/CA (collision avoidance).

### ARP: finding a MAC from an IP

Your PC knows the gateway's IP (from DHCP) but not its MAC. It broadcasts an **ARP** request: "Who has 10.0.0.1? Tell 10.0.0.5." The gateway replies with its MAC, and the PC caches the answer for a few minutes.

```bash
ip neigh show          # Linux ARP/neighbour cache
arp -a                 # Windows and macOS
# 10.0.0.1  dev eth0  lladdr 00:1a:8c:4f:00:01  REACHABLE
```

IPv6 replaces ARP with **Neighbor Discovery** (NDP), which uses ICMPv6 multicast instead of broadcast.

### VLANs

A **VLAN** (802.1Q) splits one physical switch into several logical LANs by tagging frames with a 12-bit VLAN ID. Agents' PCs might be VLAN 10, printers VLAN 20, and the IP phones VLAN 30. Broadcasts stay inside a VLAN, and traffic between VLANs must go through a router, where you can put a firewall rule. A link carrying several VLANs between switches is a **trunk**.

> **Tip:** When a PC shows an IP starting with `169.254.x.x` it means DHCP never answered. Nine times out of ten the cause is layer 2: wrong VLAN on the switch port, a dead cable, or a disabled port. Check the link light before anything else.

### Try It Yourself

```bash
# Inspect layer 2 on your own machine
ip -br link                   # interface names, state UP/DOWN, MAC addresses
ethtool eth0 | grep -E 'Speed|Duplex|Link'   # negotiated speed and duplex (Linux)
ip neigh                      # who you have talked to on this LAN and their MACs
sudo tcpdump -i eth0 -n -c 3 arp   # watch ARP requests and replies
```

### Quiz

1. What does a switch use to decide which port to forward a frame to?
- [ ] The destination IP address
- [x] The destination MAC address and its MAC table
- [ ] The TCP port number
> Switches are layer 2 devices; they learn MAC-to-port mappings and forward accordingly.

2. What is `FF:FF:FF:FF:FF:FF`?
- [x] The Ethernet broadcast address
- [ ] An invalid MAC
- [ ] The switch's own address
> A frame sent to all F's is delivered to every host in the VLAN.

3. What does ARP do?
- [ ] Assigns IP addresses
- [x] Finds the MAC address that belongs to an IP address on the local network
- [ ] Encrypts frames
> ARP is the glue between layer 3 addresses and layer 2 addresses on one link.

4. Which statement about VLANs is true?
- [ ] Devices in different VLANs can exchange broadcasts
- [x] Traffic between VLANs must pass through a router or layer 3 switch
- [ ] VLANs require separate physical switches
> A VLAN is a separate broadcast domain; crossing between them is a routing operation.

### Exercises

1. **Read the frame** — A capture shows destination `FF:FF:FF:FF:FF:FF`, source `3C:7C:3F:1A:2B:9D`, EtherType `0x0806`. What is happening?
<details><summary>Solution</summary>

```text
EtherType 0x0806 is ARP and the destination is broadcast:
the host with MAC 3C:7C:3F:1A:2B:9D is asking "who has IP X?" for some address
it needs to reach, most likely its default gateway right after boot or DHCP.
```

</details>

2. **Plan the VLANs** — A 48-port switch serves 20 agent PCs, 4 printers, 2 servers and a guest Wi-Fi access point. Propose VLAN IDs and say where the firewall rules go.
<details><summary>Solution</summary>

```text
VLAN 10  Agents (20 ports)
VLAN 20  Printers (4 ports)           agents -> printers allowed on TCP 9100/631 only
VLAN 30  Servers (2 ports)            agents -> servers on 445, 443, 3389 as needed
VLAN 40  Guest Wi-Fi (AP port, tagged) guest -> internet only, no access to 10/20/30
Uplink to router: trunk carrying 10, 20, 30, 40. Rules live on the router/L3 switch.
```

</details>

### Interview Questions

**Q: How does a switch learn where devices are, and what happens for an unknown destination?**
A switch starts with an empty MAC table. Every time a frame arrives it records the source MAC and the ingress port, with an ageing timer of about five minutes. For forwarding it looks up the destination MAC; if found it sends the frame out only that port, if not it floods the frame out of every port in the same VLAN except the one it came from, and the reply then teaches it the missing entry. Broadcast and most multicast frames are always flooded. I mention that this learning behaviour is why MAC flooding attacks exist: fill the table with fake sources and the switch degrades into a hub, so production switches enable port security to cap MACs per port.

**Q: A PC gets a 169.254 address. What is that and how do you troubleshoot it?**
It is an APIPA (Automatic Private IP Addressing) address that Windows and other systems self-assign when no DHCP server answers within a few seconds. I check layer 1 and 2 first: link light and negotiated speed, then whether the switch port is in the right VLAN and not shut down or blocked by port security. Then I check whether DHCP is reachable at all: `ipconfig /release` and `/renew`, and a capture for DHCP Discover packets leaving and Offers returning. If other machines on the same switch get addresses, it is almost always the port or cable; if none do, the DHCP server or the DHCP relay on the router is down.

**Q: Explain full duplex and why duplex mismatch was such a common fault.**
Full duplex means both ends can transmit at the same time over separate wire pairs, with no collisions; half duplex means one at a time with CSMA/CD arbitration. Auto-negotiation lets both ends agree, but if one side is hard-coded to 100 Mbps full duplex and the other is left on auto, the auto side cannot see negotiation pulses and falls back to half duplex. The result is a link that works but with heavy CRC errors and late collisions under load, so file copies crawl while pings look fine. The fix is to set both sides to auto or both to the same fixed setting, and the tell-tale sign in `ethtool` or a switch's `show interface` is a climbing late-collision counter.

## IP addresses (IPv4 and IPv6) and DHCP

The **Internet Protocol** gives every host a logical address that works across networks, unlike a MAC address which only means something on one link. Two versions are in use: **IPv4** from 1981 and **IPv6** from 1998, which is now carrying around half of all traffic to big sites.

### IPv4 addresses

An IPv4 address is 32 bits, written as four decimal numbers 0–255 separated by dots: `192.168.1.25`. That gives 4.3 billion addresses, which ran out in 2011; NAT (an Intermediate chapter) is how we cope.

An address has two parts: the **network** portion, shared by every host on the same LAN, and the **host** portion, unique within it. The **subnet mask** says where the split is. `255.255.255.0` means the first 24 bits are network, so `192.168.1.25/24` is host 25 on network `192.168.1.0`.

```text
Address     192.168.1.25    = 11000000.10101000.00000001.00011001
Mask        255.255.255.0   = 11111111.11111111.11111111.00000000
Network     192.168.1.0     (host bits set to 0)
Broadcast   192.168.1.255   (host bits set to 1)
Usable      192.168.1.1 - 192.168.1.254   (254 hosts)
```

### Private and special ranges

| Range | Purpose |
|---|---|
| `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` | Private (RFC 1918), never routed on the internet |
| `127.0.0.0/8` | Loopback; `127.0.0.1` is always "this machine" |
| `169.254.0.0/16` | Link-local / APIPA, self-assigned when DHCP fails |
| `100.64.0.0/10` | Carrier-grade NAT (your ISP's inside network) |
| `224.0.0.0/4` | Multicast |
| `0.0.0.0` | "Any address" when listening; "no address yet" as a source |

Your office PC almost certainly has a private address; the whole office shares one or a few **public** addresses through NAT at the router.

### IPv6 addresses

IPv6 addresses are 128 bits, written as eight groups of four hex digits: `2001:0db8:0000:0000:0000:0000:0000:0001`. Two shortening rules: drop leading zeros in each group, and replace one run of all-zero groups with `::`. The address above becomes `2001:db8::1`. The first 64 bits are normally the network prefix and the last 64 the interface identifier, so a `/64` is the standard LAN size with 18 quintillion addresses.

| IPv6 range | Purpose |
|---|---|
| `::1` | Loopback |
| `fe80::/10` | Link-local, every interface has one automatically |
| `fc00::/7` (in practice `fd00::/8`) | Unique local, the private range |
| `2000::/3` | Global unicast, the public internet |
| `ff00::/8` | Multicast (there is no broadcast in IPv6) |

IPv6 hosts can configure themselves with **SLAAC** (Stateless Address Autoconfiguration) by listening for Router Advertisements, so DHCP is optional.

### DHCP: getting an address automatically

**DHCP** (Dynamic Host Configuration Protocol) hands out IP addresses, the subnet mask, the default gateway and the DNS servers. It runs over UDP ports 67 (server) and 68 (client) and follows four steps you should be able to recite: **DORA**.

```text
1. DISCOVER  client -> broadcast 255.255.255.255  "any DHCP server out there?"
2. OFFER     server -> client                     "you can have 192.168.1.25 for 8 hours"
3. REQUEST   client -> broadcast                  "I accept 192.168.1.25 from server X"
4. ACK       server -> client                     "confirmed, here are gateway and DNS"
```

The **lease** has a duration; the client renews at 50% of the lease time. Servers can pin a **reservation** so that the print server always gets `192.168.1.10` by MAC address. Because DISCOVER is a broadcast, DHCP servers must be on the same VLAN or the router must run a **DHCP relay** (`ip helper-address` in Cisco terms) that forwards the broadcast as a unicast.

```bash
# See what DHCP gave you
ipconfig /all                   # Windows: look for DHCP Server, Lease Obtained, Lease Expires
ipconfig /release && ipconfig /renew
# Linux (NetworkManager)
nmcli device show eth0 | grep -E 'IP4|DHCP'
sudo dhclient -v eth0           # verbose DORA exchange
```

> **Interview note:** Be ready for "what is the default gateway?" It is the router's IP on your subnet. Any destination outside your own network is sent to the gateway's MAC address with the real destination IP still in the packet. If the gateway is wrong, you can reach the LAN but nothing beyond it.

### Static versus dynamic

Servers, printers and network gear get **static** addresses (or DHCP reservations) so that other systems can find them. Laptops and phones get dynamic leases. Document the static ones in a spreadsheet; the number of outages caused by two devices both statically set to `.10` is not small.

### Try It Yourself

```bash
# Read your own IPv4 and IPv6 configuration and interpret it
ip -4 addr show                 # look for "inet 192.168.1.25/24"
ip -6 addr show                 # "inet6 fe80::.../64 scope link" is the link-local address
ip route | grep default         # the default gateway
cat /etc/resolv.conf            # DNS servers (Linux)
# Windows one-liner that shows everything
ipconfig /all
```

### Quiz

1. What is the broadcast address of `10.5.20.0/24`?
- [ ] 10.5.20.0
- [x] 10.5.20.255
- [ ] 10.5.255.255
> With a /24 mask the last octet is the host part; all host bits set to 1 gives .255.

2. Which of these is a private IPv4 address?
- [ ] 8.8.8.8
- [x] 172.20.4.9
- [ ] 100.0.0.1
> 172.16.0.0 to 172.31.255.255 is the RFC 1918 172.16/12 private block.

3. What is the shortest correct form of `2001:0db8:0000:0000:0000:ff00:0042:8329`?
- [x] 2001:db8::ff00:42:8329
- [ ] 2001:db8:0:0:0:ff00:42:8329
- [ ] 2001:db8::ff00::42:8329
> Leading zeros go, and exactly one run of zero groups becomes `::`.

4. In DORA, which message is the client's acceptance of an offer?
- [ ] Discover
- [ ] Offer
- [x] Request
> The client broadcasts a Request naming the server it chose; the server replies with an Ack.

### Exercises

1. **Work out the network** — A PC has `192.168.40.130` with mask `255.255.255.0`. Give the network address, broadcast address, and say whether `192.168.41.5` is on the same LAN.
<details><summary>Solution</summary>

```text
Network:    192.168.40.0
Broadcast:  192.168.40.255
192.168.41.5 differs in the third octet, which is inside the 24 network bits,
so it is on a different network and must go via the default gateway.
```

</details>

2. **Fix the config** — An agent's PC shows IP `192.168.1.50/24`, gateway `192.168.2.1`, DNS `8.8.8.8`. LAN shares work but nothing external does. What is wrong?
<details><summary>Solution</summary>

```text
The gateway 192.168.2.1 is not inside the PC's own subnet 192.168.1.0/24,
so the PC can never ARP for it and cannot send anything off-LAN.
Set the gateway to the router's address in 192.168.1.x (for example 192.168.1.1),
or fix the DHCP scope that handed out the wrong option 3 (router).
```

</details>

### Interview Questions

**Q: Why do we have private IP addresses and how does an office with 200 PCs use one public IP?**
IPv4 has only 4.3 billion addresses and they were exhausted in 2011, so RFC 1918 reserved three blocks that anyone may use internally and that internet routers drop. The office assigns 10.x or 192.168.x addresses inside, and the edge router performs NAT, rewriting each outgoing packet's source to the single public address and a unique port, then mapping replies back using a translation table. The trade-off is that inbound connections cannot reach a private host unless a port-forward is configured, which is both a security benefit and a nuisance for peer-to-peer applications. IPv6 removes the need by giving every device a global address, and then firewalls, not address hiding, provide the protection.

**Q: Describe the DHCP process and what breaks when the DHCP server is on another subnet.**
A booting client has no address, so it broadcasts a DHCPDISCOVER from 0.0.0.0 to 255.255.255.255 on UDP 68 to 67; any server replies with a DHCPOFFER containing an address, mask, lease time and options; the client broadcasts a DHCPREQUEST naming the offer it accepts, and the chosen server sends DHCPACK. Because the discover is a link-layer broadcast, routers do not forward it, so a server on another subnet never hears it and clients fall back to 169.254 addresses. The fix is a DHCP relay agent on the router (ip helper-address on Cisco, `dhcrelay` on Linux), which forwards the broadcast as unicast to the server and fills in the giaddr field so the server knows which scope to allocate from.

**Q: Why is IPv6 adoption still incomplete if IPv4 ran out fifteen years ago?**
Because NAT and carrier-grade NAT made IPv4 scarcity survivable, and IPv6 is not backward compatible, so every router, firewall, application and monitoring tool on a path has to support it before anyone benefits. Large content providers and mobile carriers moved early because address cost and NAT state tables hurt them most; enterprise internal networks moved last because they gain little and risk a lot. Dual-stack, where hosts run both and prefer IPv6, is the standard transition, with 464XLAT and NAT64 used on IPv6-only mobile networks to reach legacy IPv4 sites. A good answer notes that "IPv6 is off" is often the cause of odd slowness on dual-stack networks when the v6 path is broken and the browser has to time out before falling back.

# LEVEL: Intermediate

## Subnetting and CIDR with worked examples

**Subnetting** splits one address block into smaller networks. **CIDR** (Classless Inter-Domain Routing) is the `/n` notation that says how many leading bits are the network part. Interviews for any infrastructure or cloud role include at least one subnetting question, so practise until the arithmetic is automatic.

### The prefix length tells you everything

A `/n` prefix leaves `32 - n` host bits, so the block has `2^(32-n)` addresses. Subtract 2 for the network and broadcast addresses to get usable hosts (on normal LANs).

| Prefix | Mask | Addresses | Usable hosts | Typical use |
|---|---|---|---|---|
| /30 | 255.255.255.252 | 4 | 2 | Point-to-point router links |
| /29 | 255.255.255.248 | 8 | 6 | Tiny DMZ |
| /27 | 255.255.255.224 | 32 | 30 | Small office |
| /26 | 255.255.255.192 | 64 | 62 | Department |
| /24 | 255.255.255.0 | 256 | 254 | The classic LAN |
| /22 | 255.255.252.0 | 1,024 | 1,022 | Large floor with Wi-Fi |
| /16 | 255.255.0.0 | 65,536 | 65,534 | A whole company or a cloud VPC |

The old **classful** system (Class A /8, Class B /16, Class C /24) is dead but still appears in exam questions. Just translate: Class C means /24.

### Worked example 1: split a /24 into four subnets

You have `192.168.10.0/24` and need four equal subnets for agents, printers, servers and Wi-Fi. Four subnets need 2 extra network bits, so each is a `/26` with 64 addresses.

```text
Block size = 256 / 4 = 64

192.168.10.0/26     hosts .1  - .62    broadcast .63    Agents
192.168.10.64/26    hosts .65 - .126   broadcast .127   Printers
192.168.10.128/26   hosts .129 - .190  broadcast .191   Servers
192.168.10.192/26   hosts .193 - .254  broadcast .255   Wi-Fi
```

The trick: the **block size** is `256 - last non-255 octet of the mask`. Mask `.192` gives 64, so subnets start at multiples of 64.

### Worked example 2: which subnet is this host in?

Host `172.16.37.200/20`. A /20 mask is `255.255.240.0`. The interesting octet is the third one; block size is `256 - 240 = 16`. Multiples of 16 up to 37: 0, 16, 32, 48. The largest one not exceeding 37 is 32.

```text
Network:    172.16.32.0/20
Range:      172.16.32.1  - 172.16.47.254
Broadcast:  172.16.47.255
```

So `172.16.37.200` and `172.16.45.3` are on the same subnet; `172.16.48.1` is not.

### Worked example 3: VLSM, subnets of different sizes

**VLSM** (Variable Length Subnet Masking) means you do not have to make every subnet the same size. Requirements: 100 hosts, 50 hosts, 20 hosts, and two point-to-point links. Start with the biggest.

```text
Need 100 -> 128 block -> /25    10.0.0.0/25      (.1 - .126)
Need  50 ->  64 block -> /26    10.0.0.128/26    (.129 - .190)
Need  20 ->  32 block -> /27    10.0.0.192/27    (.193 - .222)
Link  2  ->   4 block -> /30    10.0.0.224/30    (.225 - .226)
Link  2  ->   4 block -> /30    10.0.0.228/30    (.229 - .230)
Spare:                         10.0.0.232 - 10.0.0.255
```

Always allocate from largest to smallest so blocks stay aligned to their size.

### Supernetting and route summarisation

CIDR also works upwards. Four contiguous /24s, `10.1.4.0` to `10.1.7.0`, share their first 22 bits, so a router can advertise one route `10.1.4.0/22` instead of four. Fewer routes means smaller routing tables and faster convergence. The check: the starting network must be a multiple of the block size (4 is a multiple of 4, so it works; 10.1.5.0 to 10.1.8.0 would not).

> **Tip:** Cloud providers steal addresses from every subnet. AWS reserves the first four and the last address of each VPC subnet, so a /24 in AWS has 251 usable hosts, not 254, and the smallest allowed subnet is /28 with 11 usable. Azure reserves five. Say this in cloud interviews and you will stand out.

### Tools that do the arithmetic

```bash
ipcalc 192.168.10.0/26          # Linux: prints network, broadcast, hosts, mask
sipcalc 172.16.37.200/20        # more detail, splits into subnets with -s
python3 -c "import ipaddress as i; n=i.ip_network('172.16.37.200/20', strict=False); print(n, n.broadcast_address, n.num_addresses-2)"
```

In an interview you will not have these, so do the block-size method by hand, then use the tools to check yourself while practising.

### Try It Yourself

```bash
# Verify the three worked examples with Python's standard library (no install needed)
python3 - <<'PY'
import ipaddress as ip
for s in ip.ip_network('192.168.10.0/24').subnets(new_prefix=26):
    print(s, list(s.hosts())[0], list(s.hosts())[-1], s.broadcast_address)
n = ip.ip_network('172.16.37.200/20', strict=False)
print(n, n.broadcast_address, n.num_addresses - 2, 'usable')
print(ip.ip_address('172.16.48.1') in n)
PY
```

### Quiz

1. How many usable host addresses are in a /27?
- [ ] 32
- [x] 30
- [ ] 62
> 2^(32-27) = 32 addresses, minus network and broadcast = 30.

2. Which subnet does `10.20.77.5/22` belong to?
- [ ] 10.20.77.0/22
- [x] 10.20.76.0/22
- [ ] 10.20.72.0/22
> A /22 has block size 4 in the third octet; multiples of 4 up to 77 end at 76.

3. Summarise `10.1.4.0/24` through `10.1.7.0/24` as one route.
- [x] 10.1.4.0/22
- [ ] 10.1.4.0/23
- [ ] 10.1.0.0/22
> Four /24s share 22 leading bits and 4 is a multiple of 4, so 10.1.4.0/22 covers exactly them.

4. What is the mask for /29?
- [ ] 255.255.255.240
- [x] 255.255.255.248
- [ ] 255.255.255.224
> /29 leaves 3 host bits: 256 - 8 = 248 in the last octet.

### Exercises

1. **Subnet a title office** — From `10.50.0.0/24` allocate: 60 agent PCs, 25 devices in scanning, 10 servers, and one /30 to the ISP. Show each subnet with range and broadcast.
<details><summary>Solution</summary>

```text
60 hosts  -> /26 (62 usable)   10.50.0.0/26     .1 - .62     bcast .63
25 hosts  -> /27 (30 usable)   10.50.0.64/27    .65 - .94    bcast .95
10 hosts  -> /28 (14 usable)   10.50.0.96/28    .97 - .110   bcast .111
ISP link  -> /30 (2 usable)    10.50.0.112/30   .113 - .114  bcast .115
Spare: 10.50.0.116 - 10.50.0.255
```

</details>

2. **Same subnet or not?** — Mask is `255.255.255.192`. Are `192.168.5.126` and `192.168.5.129` on the same subnet? Show your working.
<details><summary>Solution</summary>

```text
Block size 256 - 192 = 64. Subnets start at .0, .64, .128, .192.
.126 is in 192.168.5.64/26 (.65 - .126).
.129 is in 192.168.5.128/26 (.129 - .190).
Different subnets; they need a router to talk.
```

</details>

3. **Cloud usable hosts** — How many usable addresses does a /26 subnet have in AWS?
<details><summary>Solution</summary>

```text
64 addresses - 5 reserved by AWS (network, VPC router, DNS, future use, broadcast) = 59.
```

</details>

### Interview Questions

**Q: Given 192.168.100.0/24, carve out subnets for 100, 50 and 25 hosts. Talk me through it.**
I allocate largest first so each block stays aligned. 100 hosts need 7 host bits, a /25 with 126 usable: 192.168.100.0/25, hosts .1 to .126, broadcast .127. 50 hosts need 6 bits, a /26 with 62 usable: 192.168.100.128/26, hosts .129 to .190, broadcast .191. 25 hosts need 5 bits, a /27 with 30 usable: 192.168.100.192/27, hosts .193 to .222, broadcast .223. That leaves 192.168.100.224/27 spare for growth or point-to-point links. The general rule I apply is block size equals 256 minus the mask's interesting octet, and every subnet must start on a multiple of its block size.

**Q: Why does CIDR exist and what problem did it solve?**
Classful addressing only offered /8, /16 and /24, so an organisation with 300 hosts had to take a Class B with 65,534 addresses and waste 99.5% of it, while the global routing table grew with one entry per Class C. CIDR, introduced in 1993, allows any prefix length, so allocations can match need, and contiguous blocks can be summarised into one route, which kept backbone routers' tables manageable. It also enabled the hierarchical allocation from IANA to regional registries to ISPs to customers that we use today. The practical skill it demands is exactly the block-size arithmetic interviewers test.

**Q: What is the difference between a /31 and a /30 for a point-to-point link?**
A /30 gives four addresses of which two are usable, wasting half on network and broadcast addresses that a two-router link never needs. RFC 3021 allows /31 on point-to-point links, using both addresses as hosts with no broadcast, halving address consumption on large backbones with thousands of links. Most modern routers and Linux support it, but some older gear and some monitoring tools choke, so I would use /31 on a new core network and /30 where legacy devices are involved. In IPv6 the equivalent debate is /127 versus /64 for links, and RFC 6164 recommends /127.

## Routing basics and routers

A **router** forwards packets between networks by looking at the destination IP and consulting a **routing table**. Every host has a small routing table too, which is why the default gateway concept from the Beginner level is really just routing with one rule.

### The routing table

```bash
ip route show                    # Linux
# default via 10.0.0.1 dev eth0 proto dhcp metric 100
# 10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.5
# 10.8.0.0/24 via 10.8.0.2 dev tun0
route print                      # Windows shows the same idea with a "Metric" column
```

Read each line as "to reach *this prefix*, send via *this next hop* out of *this interface*". A destination is matched against every prefix and the **longest matching prefix** wins, because a more specific route is assumed to be more accurate. `10.8.0.7` matches both `default` (/0) and `10.8.0.0/24`; the /24 wins, so the packet goes into the VPN tunnel.

### Hop by hop

The sending host does not know the whole path. It only decides the next hop. Each router along the way makes its own decision using its own table, decrements the packet's **TTL** (Time To Live) by one, and forwards. When TTL hits zero the router discards the packet and sends back an ICMP "Time Exceeded" message. That behaviour is what `traceroute` exploits: it sends packets with TTL 1, 2, 3 and so on, and each expiry reveals one router.

```text
PC 10.0.0.5 -> R1 (office edge) -> R2 (ISP Lahore) -> R3 (ISP Karachi)
    -> R4 (submarine cable landing, Marseille) -> ... -> R11 (data centre, Dallas) -> server
```

### Static versus dynamic routing

**Static routes** are typed by an administrator. Fine for a small office with one uplink and one VPN. **Dynamic routing protocols** let routers tell each other what networks they can reach and recompute paths when a link fails.

| Protocol | Type | Where used | How it picks a path |
|---|---|---|---|
| **RIP** | Distance vector | Labs, legacy | Fewest hops (max 15); slow to converge |
| **OSPF** | Link state | Inside an organisation (IGP) | Lowest total cost (bandwidth-based) using Dijkstra |
| **EIGRP** | Advanced distance vector | Cisco-heavy enterprises | Composite metric of bandwidth and delay |
| **BGP** | Path vector | Between organisations (the internet) | Policy: AS path length, local preference, MED |

Inside one organisation you run an **IGP** (Interior Gateway Protocol) such as OSPF. Between organisations, each identified by an **Autonomous System number** (ASN), the entire internet runs one protocol: **BGP**. When a big outage takes down a company worldwide, the cause is often a bad BGP announcement that withdrew their prefixes from every other network's table.

### Administrative distance and metrics

When two sources offer routes to the same prefix, the router prefers the one with the lower **administrative distance** (trustworthiness of the source: connected 0, static 1, eBGP 20, OSPF 110, RIP 120 on Cisco). Within one protocol it prefers the lower **metric**. Longest prefix match is applied first, before either of these.

```text
Decision order for a destination IP:
1. Longest matching prefix
2. Lowest administrative distance among equal prefixes
3. Lowest metric within the winning protocol
4. Equal-cost multipath: load-share across the ties
```

### ICMP: the network's error channel

**ICMP** carries control messages, not user data. `ping` sends ICMP Echo Request (type 8) and expects Echo Reply (type 0). Destination Unreachable (type 3) tells you a route or port does not exist, and code 4 within it, "fragmentation needed", is the message Path MTU Discovery depends on. Blocking all ICMP at a firewall is a common mistake that silently breaks large transfers.

> **Warning:** Asymmetric routing is real: the path from Lahore to Dallas can differ from the path back. `traceroute` only shows the forward path, so when a client says "it is slow from our side" and your trace looks clean, ask them to run a trace from their end too.

### A home and small-office router

The box on the wall is several things in one: a router (LAN to internet), a switch (four LAN ports), a Wi-Fi access point, a DHCP server, a DNS forwarder, a NAT device and a stateful firewall. When troubleshooting, ask which of those roles has failed rather than treating it as one thing.

### Try It Yourself

```bash
# Follow the hop-by-hop path and read the routing decision on your own host
traceroute -n 1.1.1.1            # Linux/macOS; Windows: tracert -d 1.1.1.1
ip route get 8.8.8.8             # Linux: which route and interface will be used for this destination
# Add a temporary static route (Linux, needs root) and remove it again
sudo ip route add 192.0.2.0/24 via 10.0.0.1
ip route show | grep 192.0.2
sudo ip route del 192.0.2.0/24
```

### Quiz

1. A host's table has `default via 10.0.0.1` and `10.8.0.0/16 via 10.8.0.2`. Where does a packet to `10.8.44.9` go?
- [ ] 10.0.0.1
- [x] 10.8.0.2
- [ ] It is dropped
> Longest prefix match: /16 is more specific than the /0 default route.

2. What does a router do to the TTL field?
- [ ] Sets it to 64
- [x] Decrements it by one and drops the packet at zero
- [ ] Ignores it
> TTL prevents packets from looping forever; traceroute relies on the ICMP message sent at zero.

3. Which protocol routes between autonomous systems on the internet?
- [ ] OSPF
- [ ] RIP
- [x] BGP
> BGP is the only exterior gateway protocol in use; OSPF and RIP are interior protocols.

4. Which is chosen first when several routes could match a destination?
- [x] The longest matching prefix
- [ ] The lowest metric
- [ ] The lowest administrative distance
> Specificity wins before any comparison of route sources or metrics.

### Exercises

1. **Read a table** — Given routes `0.0.0.0/0 via 203.0.113.1`, `10.0.0.0/8 via 10.1.1.1`, `10.0.5.0/24 via 10.1.1.2`, give the next hop for `10.0.5.7`, `10.9.9.9` and `172.16.0.1`.
<details><summary>Solution</summary>

```text
10.0.5.7   -> 10.1.1.2   (matches /24, most specific)
10.9.9.9   -> 10.1.1.1   (matches /8 only)
172.16.0.1 -> 203.0.113.1 (only the default route matches)
```

</details>

2. **Explain the trace** — A `tracert` to the client portal shows hops 1–6 replying, hops 7–9 as `* * *`, then hop 10 replies and the page loads fine. Is anything wrong?
<details><summary>Solution</summary>

```text
No. Hops 7-9 are routers that do not send ICMP Time Exceeded (rate-limited or
filtered), but they still forward traffic, which is proven by hop 10 replying and
the page working. Only a trace that ends in stars with the destination never
answering indicates a real black hole.
```

</details>

### Interview Questions

**Q: What happens on a router when a packet arrives?**
It checks the frame's destination MAC is its own, strips the frame, validates the IP header checksum, and decrements TTL, discarding the packet and sending ICMP Time Exceeded if it reaches zero. It then performs a longest-prefix-match lookup on the destination address in the forwarding table (in hardware on a real router, a TCAM or trie), which yields a next-hop IP and an egress interface. It resolves the next hop's MAC via its ARP cache, builds a new frame with its own MAC as source, and transmits, possibly after applying ACLs, NAT or QoS marking. The IP header, apart from TTL and checksum, and everything above it are untouched, which is why end-to-end addressing survives many hops.

**Q: Compare OSPF and BGP and say when you would use each.**
OSPF is a link-state interior protocol: every router floods its link states so all build the same map and run Dijkstra to compute shortest paths by cost, converging in seconds and scaling to a few hundred routers per area. BGP is a path-vector exterior protocol that exchanges reachability with the full AS path and applies policy such as local preference and prepending; it scales to the whole internet, over one million prefixes, but converges in tens of seconds to minutes and picks paths by policy rather than speed. I would use OSPF inside a campus or data centre where I control every router and want fast failover, and BGP to connect to two ISPs for redundancy, to peer with a cloud provider over Direct Connect or ExpressRoute, and, increasingly, inside large data centres where its policy control and scale beat OSPF.

**Q: A user can reach some websites but not others. How do you approach it?**
I first separate DNS from routing by testing the failing sites by IP and by name, and compare with a working site. If the IP works but the name does not, it is DNS. If the IP fails too, I traceroute to the working and failing destinations and look for where the paths diverge and where the failing one stops, which usually points to a specific ISP or a bad route. I also check MTU with a do-not-fragment ping because sites behind a tunnel or PPPoE fail exactly like this while small sites work. Finally I check for blocking: a proxy, a firewall category filter, or a geo-block, by running the same test from a phone on mobile data to compare.

## TCP vs UDP: handshake, reliability and ports

The transport layer delivers data between programs, identified by port numbers. It offers two very different services: **TCP** (Transmission Control Protocol), reliable and ordered, and **UDP** (User Datagram Protocol), fast and best-effort. Choosing the right one is a design decision interviewers ask about constantly.

| Feature | TCP | UDP |
|---|---|---|
| Connection | Yes, three-way handshake | None |
| Reliability | Lost segments are retransmitted | None; the application must cope |
| Ordering | In-order delivery guaranteed | Datagrams may arrive out of order |
| Flow control | Yes (receive window) | No |
| Congestion control | Yes | No |
| Header size | 20 bytes minimum | 8 bytes |
| Speed | Slower to start, overhead per byte | Minimal latency |
| Used by | HTTP/1.1, HTTP/2, SMTP, SSH, FTP, databases | DNS, DHCP, VoIP, video, games, QUIC/HTTP/3 |

### The TCP three-way handshake

Before any data flows, client and server agree on starting sequence numbers.

```text
Client                                     Server
  | ---- SYN, seq=1000 ------------------> |   "I want to talk; my numbering starts at 1000"
  | <--- SYN+ACK, seq=5000, ack=1001 ----- |   "OK; mine starts at 5000; I got yours"
  | ---- ACK, ack=5001 ------------------> |   "Got yours too"
  | ==== data flows in both directions === |
```

One round trip is spent before the first byte of HTTP is sent. Add TLS and you spend another one or two. This is the cost of reliability, and it is why Lahore-to-Dallas latency hurts so much on chatty applications.

### Sequence numbers, ACKs and retransmission

Every byte in a TCP stream has a sequence number. The receiver acknowledges the next byte it expects. If the sender does not see an ACK before its **retransmission timeout** (RTO, based on the measured round-trip time) or receives three duplicate ACKs, it resends. This turns a lossy network into a reliable byte stream, at the cost of delay when loss occurs.

### Flow control and windows

The receiver advertises a **window**: how many bytes it can accept right now. The sender never has more than one window of unacknowledged data in flight. Throughput is therefore bounded by `window / round-trip time`. With a 64 KB window and 230 ms RTT the maximum is about 285 KB/s no matter how fast the link is, which is why long-distance transfers need window scaling (RFC 1323) and why a single TCP stream from Lahore to Texas rarely fills a 100 Mbps pipe.

### Closing a connection

Closing takes four messages: each side sends FIN and receives ACK. The side that closes first sits in **TIME_WAIT** for about 60 seconds to absorb stray packets, which is why a busy server can show thousands of TIME_WAIT sockets in `ss -tan`; it is normal. A **RST** (reset) is the abrupt alternative, sent when a packet arrives for a port nobody is listening on, which is how "connection refused" is reported instantly.

### TCP states you will see

```bash
ss -tan state established    # Linux: live connections
ss -tln                      # LISTEN sockets (servers waiting)
netstat -an | findstr 3389   # Windows: state column shows LISTENING, ESTABLISHED, TIME_WAIT
```

`LISTEN` means a server is ready. `SYN_SENT` stuck for a long time means the server or a firewall is not answering. `CLOSE_WAIT` piling up means the local application forgot to close sockets (a bug).

### UDP: when losing a packet is better than waiting

UDP puts a port pair, a length and a checksum in front of the data and sends it. Nothing else. A dropped packet is gone. That sounds bad until you consider a voice call: retransmitting a 20 ms audio slice that arrives 300 ms late is useless; the call has moved on. DNS uses UDP because a query fits in one packet and retrying at the application layer is simpler than a handshake. Video streaming, online games, NTP and syslog make the same choice.

```text
UDP header: | Src port 2 B | Dst port 2 B | Length 2 B | Checksum 2 B | data ... |
```

**QUIC**, the transport under HTTP/3, is built on UDP precisely so it can implement its own reliability and encryption in user space without waiting for operating systems to update TCP. It is covered in the Expert level.

> **Interview note:** "Is UDP unreliable?" The precise answer is that UDP provides no reliability mechanism; the network is the same either way. Applications on UDP can add their own acknowledgements (QUIC, many game engines), so "unreliable" describes the protocol's guarantees, not the outcome.

### Try It Yourself

```bash
# Watch a full TCP handshake and teardown against a real server
sudo tcpdump -i any -n 'tcp port 80 and host example.com' &
curl -s http://example.com/ > /dev/null
# Expect: [S], [S.], [.], data [P.], then [F.] [F.] [.]
# Test whether a port is open without any client software
nc -zv example.com 443           # Linux/macOS netcat: "succeeded" = SYN+ACK came back
Test-NetConnection example.com -Port 443    # Windows PowerShell
# Send a UDP DNS query by hand and see the single-packet exchange
dig @1.1.1.1 example.com +noall +answer
```

### Quiz

1. How many packets does the TCP handshake take?
- [ ] 2
- [x] 3
- [ ] 4
> SYN, SYN-ACK, ACK. The teardown takes four (FIN and ACK in each direction).

2. Which is a reason to choose UDP?
- [ ] You need guaranteed in-order delivery
- [x] Late data is worthless, as in a voice call
- [ ] You need flow control
> Real-time media prefers to skip lost packets rather than stall waiting for retransmission.

3. What limits TCP throughput on a high-latency link even when bandwidth is plentiful?
- [x] Window size divided by round-trip time
- [ ] The MAC address table
- [ ] The number of hops
> The sender cannot have more than one window in flight, so throughput = window / RTT.

4. What does a TCP RST indicate?
- [ ] The connection closed normally
- [x] The peer aborted or nothing is listening on that port
- [ ] The receiver's window is full
> A reset is the immediate "no" that produces "connection refused".

### Exercises

1. **Pick the protocol** — Choose TCP or UDP for: a bank transfer API, an IP camera stream, a DNS query, an SFTP upload of scanned deeds, NTP time sync. Justify each in one line.
<details><summary>Solution</summary>

```text
Bank transfer API  -> TCP: every byte must arrive, in order, exactly once.
IP camera stream   -> UDP (RTP): a late frame is useless; keep going.
DNS query          -> UDP: one packet each way; falls back to TCP for large answers.
SFTP upload        -> TCP: runs over SSH; file integrity is non-negotiable.
NTP                -> UDP: tiny, timing-sensitive, retransmission would add error.
```

</details>

2. **Compute the ceiling** — A backup from Lahore to a Dallas server has 230 ms RTT and a 256 KB TCP window. What is the maximum throughput per connection? How would you improve it?
<details><summary>Solution</summary>

```text
256 KB / 0.230 s = 1,113 KB/s = about 8.9 Mbps per connection.
Improve: enable TCP window scaling and raise the socket buffers (net.ipv4.tcp_rmem/wmem
on Linux), use a multi-stream transfer tool (rclone --transfers, aria2c -x), or place
a staging server closer to the data so the long hop is a bulk parallel copy.
```

</details>

### Interview Questions

**Q: Why does TCP need three messages to open a connection and not two?**
Each side must have its initial sequence number acknowledged so both know the other can hear them and that no stale segment from an old connection is being mistaken for a new one. With two messages the server would allocate state after the SYN without knowing the client ever received its SYN-ACK, and a delayed duplicate SYN from a previous connection could open a phantom session. The third ACK closes that loop. It also explains the SYN flood attack: attackers send SYNs and never finish, filling the server's half-open queue, which is mitigated with SYN cookies that encode the state in the sequence number instead of storing it.

**Q: Explain flow control versus congestion control.**
Flow control protects the receiver: it advertises a window in every ACK saying how much buffer it has free, and the sender never exceeds it. Congestion control protects the network: the sender maintains a separate congestion window that starts small (slow start), grows exponentially then linearly, and shrinks sharply on loss or ECN marks, because loss is taken as a sign that a router queue overflowed. The effective sending limit is the minimum of the two windows. A slow client on a fast network is a flow-control situation; a fast client on a congested WAN is a congestion-control one, and the fix differs, larger buffers versus better algorithms such as BBR or more capacity.

**Q: A service shows hundreds of connections in CLOSE_WAIT. What does that tell you?**
CLOSE_WAIT means the remote side sent FIN and our kernel acknowledged it, but our application has not called close() on the socket, so the connection cannot finish. Unlike TIME_WAIT, which is normal and time-limited, CLOSE_WAIT accumulating is almost always an application bug: an exception path that skips closing, a connection pool leak, or a thread that is blocked and never returns to its cleanup. I would identify the process with `ss -tanp state close-wait`, check its file-descriptor count against the ulimit, and restart it as a stop-gap while the leak is fixed in code with proper try/finally or context managers.

## DNS: records, resolution and caching

**DNS** (Domain Name System) translates names such as `portal.stewart.com` into IP addresses. It is a distributed, hierarchical, cached database, and it is the most common single point of failure in "the internet is down" tickets. It normally runs on UDP port 53, switching to TCP 53 for answers larger than 512 bytes (or 4,096 with EDNS) and for zone transfers.

### The hierarchy

```text
.                     root (13 named server clusters, hundreds of anycast instances)
└── com.              top-level domain (TLD), run by Verisign
    └── example.com.  second-level domain, delegated to the owner's name servers
        └── www.example.com.   a hostname inside the zone
```

Every name is read right to left, and the trailing dot is the root. Each level only knows who is responsible for the level below it: **delegation**.

### Record types you must know

| Type | Maps | Example |
|---|---|---|
| **A** | Name to IPv4 | `www.example.com. 300 IN A 93.184.216.34` |
| **AAAA** | Name to IPv6 | `www.example.com. 300 IN AAAA 2606:2800:21f:cb07:6820:80da:af6b:8b2c` |
| **CNAME** | Alias to another name | `docs.example.com. IN CNAME docs.hosting.net.` |
| **MX** | Mail exchangers with priority | `example.com. IN MX 10 mail1.example.com.` |
| **NS** | Authoritative name servers for a zone | `example.com. IN NS ns1.dnsprovider.net.` |
| **TXT** | Free text; SPF, DKIM, domain verification | `example.com. IN TXT "v=spf1 include:_spf.google.com -all"` |
| **PTR** | IP to name (reverse DNS) | `34.216.184.93.in-addr.arpa. IN PTR www.example.com.` |
| **SOA** | Zone metadata: serial, refresh, primary NS | One per zone |
| **SRV** | Service location with port | `_sip._tcp.example.com. IN SRV 10 5 5060 sip.example.com.` |

A CNAME cannot coexist with other records at the same name, which is why the bare domain `example.com` cannot be a CNAME to a CDN; providers offer ALIAS or ANAME records to work around it.

### Resolution step by step

Your PC asks a **recursive resolver** (your ISP's, or a public one like `1.1.1.1` or `8.8.8.8`). The resolver does the legwork.

```text
1. PC          -> resolver:     "A record for www.example.com?"
2. resolver    -> root server:  "www.example.com?"      root: "ask the .com servers: a.gtld-servers.net"
3. resolver    -> .com server:  "www.example.com?"      .com: "ask ns1.example.com at 198.51.100.1"
4. resolver    -> ns1.example.com (authoritative): "www.example.com?"   -> "93.184.216.34, TTL 300"
5. resolver    -> PC:           "93.184.216.34"   (and caches it for 300 seconds)
```

Steps 2–4 are **iterative** queries; the PC's single query in step 1 is **recursive**. The **authoritative** server is the one that holds the zone file; everything else is a cache.

### Caching and TTL

Every record carries a **TTL** in seconds. Resolvers, operating systems and browsers all cache. That is why a DNS change "takes time to propagate": nothing is propagating, old caches are simply waiting to expire. Before a migration, lower the TTL to 300 a day ahead, make the change, then raise it again.

```bash
# Inspect and flush local caches
ipconfig /displaydns          # Windows cache
ipconfig /flushdns
sudo resolvectl flush-caches  # Linux with systemd-resolved
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder   # macOS
```

### Querying by hand

```bash
nslookup www.example.com 1.1.1.1         # everywhere, including Windows
dig www.example.com A +short             # Linux/macOS: just the answer
dig example.com MX                        # mail servers
dig +trace www.example.com                # perform the iterative walk yourself, from the root
dig -x 93.184.216.34                      # reverse lookup (PTR)
dig @ns1.example.com www.example.com      # ask the authoritative server directly, bypassing caches
```

Read the **ANSWER SECTION** and the TTL column in `dig` output; a TTL counting down on repeat queries proves you are hitting a cache.

### The hosts file and resolution order

Before asking DNS, the OS checks its **hosts file** (`/etc/hosts` on Linux and macOS, `C:\Windows\System32\drivers\etc\hosts` on Windows). It is useful for testing a new server before changing public DNS, and it is also where malware redirects banking sites, so check it when a name resolves to something strange.

> **Tip:** `nslookup` uses its own resolver library; `ping` uses the OS resolver, which also reads the hosts file and any VPN-pushed split DNS. When they disagree, the difference tells you which layer is lying.

### DNS security

**DNSSEC** signs records so a resolver can verify they were not forged in transit (it does not encrypt). **DNS over HTTPS** (DoH, port 443) and **DNS over TLS** (DoT, port 853) encrypt the query between you and the resolver, which stops a coffee-shop Wi-Fi from seeing or altering your lookups. Modern browsers and Windows 11 can use DoH by default.

### Try It Yourself

```bash
# Follow a name from the root to the answer, then prove caching with TTLs
dig +trace www.example.com | tail -20
dig www.example.com +noall +answer      # note the TTL
sleep 5
dig www.example.com +noall +answer      # TTL should be 5 lower: served from cache
dig example.com TXT +short              # SPF and verification records
dig example.com NS +short               # who is authoritative
```

### Quiz

1. Which record type maps a name to an IPv6 address?
- [ ] A
- [x] AAAA
- [ ] PTR
> AAAA is "four times as long as A", mirroring 128 versus 32 bits.

2. Why does a DNS change appear to take hours to "propagate"?
- [ ] Root servers must be updated by hand
- [x] Caches around the world hold the old record until its TTL expires
- [ ] The registrar processes changes in batches
> Nothing is pushed; each resolver simply keeps the record for the advertised TTL.

3. Which server actually holds the zone file for example.com?
- [ ] The root server
- [ ] Your ISP's recursive resolver
- [x] The authoritative name server listed in the NS records
> Recursive resolvers only cache; authority lives at the zone's NS servers.

4. Which port and protocol does an ordinary DNS query use?
- [x] UDP 53
- [ ] TCP 80
- [ ] UDP 67
> DNS is UDP 53 by default and falls back to TCP 53 for large responses and zone transfers.

### Exercises

1. **Plan a migration** — You are moving `portal.example.com` to a new IP next Friday at 22:00. Write the DNS steps with TTL values and timing.
<details><summary>Solution</summary>

```text
Thursday 22:00  Lower the A record TTL from 3600 to 300 (old TTL must expire first, so 1 h before is the minimum; a day early is safer).
Friday 22:00    Change the A record to the new IP. Within 5 minutes all caches expire.
Friday 22:10    Verify: dig @ns1 portal.example.com; dig @1.1.1.1 portal.example.com; check server logs.
Saturday        Raise TTL back to 3600 once stable. Keep the old server up for 24-48 h for stragglers.
```

</details>

2. **Diagnose** — `ping portal.example.com` returns `10.0.0.99` but `nslookup portal.example.com` returns `203.0.113.5`. What is going on?
<details><summary>Solution</summary>

```text
ping uses the OS resolver, which reads the hosts file before DNS; nslookup goes straight
to the DNS server. Someone added a hosts-file entry pointing portal.example.com at
10.0.0.99 (a test server, or malware). Inspect the hosts file and remove the line.
```

</details>

3. **Read an MX set** — `example.com` has `MX 10 mail1` and `MX 20 mail2`. Which server receives mail first and when does mail2 get used?
<details><summary>Solution</summary>

```text
Lower preference wins: mail1 (10) is tried first. mail2 (20) is used only when mail1
is unreachable or refuses the connection; it is a backup, not a load balancer.
```

</details>

### Interview Questions

**Q: Explain what happens, DNS-wise, when I type a URL into a browser.**
The browser checks its own cache, then asks the OS, which checks the hosts file and its cache, then sends a recursive query over UDP 53 to the configured resolver, or over DoH if enabled. If the resolver has no cached answer it iterates: asks a root server, which refers it to the TLD servers, which refer it to the domain's authoritative servers, which return the A or AAAA record with a TTL; each referral is itself cached so the next lookup for any `.com` name skips the root. The resolver returns the address, the OS caches it for the TTL, and the browser opens a TCP or QUIC connection. I mention that modern browsers issue A and AAAA in parallel and use Happy Eyeballs to race IPv6 and IPv4 connections.

**Q: What is the difference between a CNAME and an A record, and when is a CNAME a problem?**
An A record maps a name directly to an IPv4 address; a CNAME says "this name is an alias, look up that other name instead", which adds a lookup but lets a provider change the underlying IPs without touching your zone. The problems are that a CNAME must be the only record at its name, so you cannot put one on the zone apex where SOA and NS records must live, and that CNAME chains add latency and can loop. Providers solve the apex case with ALIAS/ANAME records or CNAME flattening, which resolve the target server-side and return A records. I would use CNAMEs for `www` and service subdomains pointing at CDNs, and A/ALIAS records at the apex.

**Q: How would you troubleshoot intermittent DNS failures on an office network?**
I would first quantify it: run `dig` in a loop against the office resolver and against a public one, logging failures and response times, to see whether the office resolver, the upstream, or the path is at fault. Common causes I check are a resolver with an exhausted UDP socket or conntrack table, a firewall dropping fragmented or TCP DNS responses so only large answers fail, a misconfigured secondary DNS that half the clients use, and DNSSEC validation failures for specific domains. I look at the resolver's logs and cache hit rate, confirm both DHCP-issued DNS servers actually work, and as a stop-gap add a working forwarder. Fixing it permanently usually means two resolvers on separate hardware with monitoring on query latency.

## HTTP and HTTPS: methods, status codes, headers and cookies

**HTTP** (Hypertext Transfer Protocol) is the application protocol of the web and of nearly every API you will call. It is a text-based request/response protocol on TCP port 80; **HTTPS** is the same protocol carried inside TLS on port 443. This chapter is about the protocol itself; the next level covers TLS.

### A request and a response

```text
GET /rates/wyoming.json HTTP/1.1
Host: api.example.com
User-Agent: curl/8.5.0
Accept: application/json
Authorization: Bearer eyJhbGciOi...

HTTP/1.1 200 OK
Date: Wed, 16 Sep 2026 09:00:00 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 812
Cache-Control: max-age=3600
ETag: "5f2a-19c4"

{"state":"WY","policies":[...]}
```

The request starts with a **request line** (method, path, version), then **headers** (one per line), a blank line, and an optional **body**. The response starts with a **status line** (version, code, reason), then headers, blank line, body. Everything before the blank line is plain text you can type by hand.

### Methods

| Method | Meaning | Safe? | Idempotent? | Has body? |
|---|---|---|---|---|
| GET | Read a resource | Yes | Yes | No |
| HEAD | GET without the body (check headers, size) | Yes | Yes | No |
| POST | Create or submit; general action | No | No | Yes |
| PUT | Replace a resource entirely | No | Yes | Yes |
| PATCH | Partially update | No | Not guaranteed | Yes |
| DELETE | Remove | No | Yes | Usually no |
| OPTIONS | Ask what is allowed (used by CORS preflight) | Yes | Yes | No |

**Safe** means it does not change server state. **Idempotent** means doing it twice has the same effect as once, which is why a client may safely retry a PUT after a timeout but must not blindly retry a POST that charges a card.

### Status codes

| Class | Meaning | Ones to memorise |
|---|---|---|
| 1xx | Informational | 101 Switching Protocols (WebSocket upgrade) |
| 2xx | Success | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirect | 301 Moved Permanently, 302 Found, 304 Not Modified, 307/308 keep the method |
| 4xx | Client error | 400 Bad Request, 401 Unauthorized (not logged in), 403 Forbidden (logged in, not allowed), 404 Not Found, 405 Method Not Allowed, 429 Too Many Requests |
| 5xx | Server error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

A 502 or 504 comes from a proxy or load balancer that could not get a good answer from the backend; a 500 is the application itself crashing. That distinction tells you which log to open.

### Headers that matter

- **Host** — which site, since one IP serves many; mandatory in HTTP/1.1.
- **Content-Type** / **Accept** — the media type sent / wanted (`application/json`, `text/html`, `multipart/form-data` for uploads).
- **Content-Length** or **Transfer-Encoding: chunked** — how the receiver knows where the body ends.
- **Cache-Control**, **ETag**, **Last-Modified** — caching; a client sends `If-None-Match: "5f2a-19c4"` and gets a tiny 304 if unchanged.
- **Authorization** — credentials: `Basic base64(user:pass)` or `Bearer <token>`.
- **Location** — target of a redirect or a newly created resource.
- **Set-Cookie** / **Cookie** — state, described below.
- **Connection: keep-alive** — reuse the TCP connection for the next request (default in HTTP/1.1).

### Cookies and sessions

HTTP is **stateless**: the server does not remember you between requests. Cookies fix that. The server replies with `Set-Cookie: session=abc123; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`, the browser stores it, and sends `Cookie: session=abc123` on every later request to that domain. The server looks up `abc123` in its session store.

- `HttpOnly` hides the cookie from JavaScript (blocks theft by XSS).
- `Secure` sends it only over HTTPS.
- `SameSite=Lax|Strict` stops it being sent on cross-site requests (mitigates CSRF).
- No expiry means a **session cookie** that dies when the browser closes.

Tokens in the `Authorization` header (JWTs) are the stateless alternative used by most APIs.

### HTTP versions

**HTTP/1.1** (1997) sends one request at a time per connection, so browsers open six connections per host. **HTTP/2** (2015) multiplexes many requests over one TLS connection with binary framing and header compression. **HTTP/3** (2022) runs over QUIC on UDP. They all keep the same methods, codes and headers; only the wire format changes.

> **Interview note:** "What is the difference between 401 and 403?" 401 means the server does not know who you are (missing or invalid credentials; try authenticating). 403 means it knows exactly who you are and the answer is no. Also know 301 versus 302: permanent redirects are cached and pass SEO weight; temporary ones are not.

### Try It Yourself

```bash
# Talk HTTP by hand and read every header
curl -v https://example.com/ 2>&1 | sed -n '1,40p'      # -v shows request and response headers
curl -I https://example.com/                           # HEAD request: headers only
curl -s -o /dev/null -w '%{http_code} %{time_total}s\n' https://example.com/   # code and timing
curl -X POST https://httpbin.org/post -H 'Content-Type: application/json' -d '{"state":"WY","amount":250000}'
curl -c jar.txt -b jar.txt https://httpbin.org/cookies/set?session=abc123     # store and send cookies
```

### Quiz

1. Which status code means "you are authenticated but not allowed"?
- [ ] 401
- [x] 403
- [ ] 404
> 401 asks you to authenticate; 403 refuses even though it knows who you are.

2. Which method is idempotent and safe to retry after a timeout?
- [ ] POST
- [x] PUT
- [ ] Neither
> PUT replaces the whole resource, so repeating it yields the same state; POST may create duplicates.

3. What does the `HttpOnly` cookie flag do?
- [ ] Sends the cookie only over HTTPS
- [x] Hides the cookie from JavaScript
- [ ] Deletes the cookie on browser close
> HttpOnly protects session cookies from being read by injected scripts; `Secure` is the HTTPS flag.

4. A 504 Gateway Timeout most likely means:
- [ ] The client's request was malformed
- [x] A proxy or load balancer did not get a timely reply from the backend
- [ ] The URL does not exist
> 502/503/504 come from the intermediary; the backend is slow, down, or unreachable.

### Exercises

1. **Design the API calls** — For a rate-calculator service, write the method and path for: fetch WY rates, create a new quote, replace quote 42, delete quote 42, check whether the rates file changed since last time.
<details><summary>Solution</summary>

```text
GET    /rates/WY
POST   /quotes                       body: {state, amount, policy_type}   -> 201 + Location: /quotes/42
PUT    /quotes/42                    body: full quote
DELETE /quotes/42                    -> 204
GET    /rates/WY  with  If-None-Match: "<etag>"   -> 304 if unchanged, 200 with new body otherwise
```

</details>

2. **Read the exchange** — A form submission returns 302 with `Location: /dashboard`, then the browser GETs `/dashboard` and receives 200. Why redirect instead of returning the dashboard directly from the POST?
<details><summary>Solution</summary>

```text
Post/Redirect/Get pattern: if the POST returned the page directly, pressing Refresh
would resubmit the form (the browser warns "resend data?"). Redirecting to a GET makes
refresh and bookmarking safe and keeps the URL bar clean.
```

</details>

### Interview Questions

**Q: HTTP is stateless. How do logins work, and what are the trade-offs between cookie sessions and JWTs?**
With cookie sessions the server creates a random session ID after login, stores the user's state server-side, and sends the ID in a Set-Cookie header with HttpOnly, Secure and SameSite flags; every later request carries it and the server looks it up, so logout and revocation are instant and the cookie itself contains nothing. A JWT instead encodes the claims and signs them, so any server can verify it without shared storage, which suits distributed APIs and mobile clients, but revocation before expiry requires a blocklist, tokens are larger, and storing them in localStorage exposes them to XSS. My default is cookie sessions for browser apps and short-lived JWTs with refresh tokens for APIs, and I never put sensitive data in a JWT because it is only signed, not encrypted.

**Q: Explain HTTP caching headers and how a CDN uses them.**
`Cache-Control` sets the policy: `max-age=3600` allows any cache to reuse the response for an hour, `private` restricts to the browser, `no-store` forbids caching, and `s-maxage` overrides for shared caches like CDNs. `ETag` and `Last-Modified` are validators: when the cached copy expires the client sends `If-None-Match` or `If-Modified-Since`, and the origin answers 304 Not Modified with no body if nothing changed, saving bandwidth. A CDN edge stores responses keyed by URL and `Vary` headers, serves hits locally, revalidates on expiry, and can be told to purge. For a rates file that updates weekly I would set `Cache-Control: public, max-age=300, stale-while-revalidate=3600` and change the filename or query string on each release for immediate invalidation.

**Q: What is CORS and why does the browser send an OPTIONS request?**
The same-origin policy stops JavaScript on one origin from reading responses from another, which protects users' sessions on other sites. CORS is the server's way to opt in: it returns `Access-Control-Allow-Origin` and related headers, and the browser enforces them. For "non-simple" requests, such as a JSON POST with an Authorization header, the browser first sends a preflight OPTIONS request asking whether the method and headers are permitted; the server must answer with the allow headers and ideally `Access-Control-Max-Age` so the preflight is cached. CORS is not a server security control, since curl ignores it; it only governs what browsers let scripts do, so authentication and authorisation still happen server-side.

## NAT, firewalls and port forwarding

Between an office LAN and the internet sit two functions that shape everything you can and cannot do: **NAT** (Network Address Translation), which lets many private addresses share few public ones, and a **firewall**, which decides which packets may pass. Most small routers do both in one box.

### NAT in action

Your PC `192.168.1.25` opens a connection from port 51234 to `93.184.216.34:443`. The router replaces the source with its public address `203.0.113.7` and a port it picks, `40001`, and records the mapping.

```text
Inside:   192.168.1.25:51234  ->  93.184.216.34:443
Outside:  203.0.113.7:40001   ->  93.184.216.34:443

NAT table on the router
Inside address       Outside address       Destination
192.168.1.25:51234   203.0.113.7:40001     93.184.216.34:443
192.168.1.30:51234   203.0.113.7:40002     93.184.216.34:443   (same inside port, different outside port)
```

When the reply arrives for `203.0.113.7:40001` the router looks up the table, rewrites the destination back to `192.168.1.25:51234`, and forwards it. This port-based sharing is properly called **PAT** (Port Address Translation) or NAT overload, but everyone just says NAT.

| Variant | Meaning |
|---|---|
| Static NAT | One private IP permanently mapped to one public IP (a mail server) |
| Dynamic NAT | A pool of public IPs handed out per session |
| PAT / masquerade | Many private hosts behind one public IP using ports (every home router) |
| CGNAT | The ISP does PAT too, so you are behind two layers; port forwarding is impossible |

### Consequences of NAT

- Inbound connections are impossible unless a mapping exists, so a home PC cannot be reached from outside by default. This is accidental security, not a substitute for a firewall.
- Protocols that embed IP addresses in their payload (FTP active mode, SIP) break unless the router has an **ALG** (Application Layer Gateway) that rewrites them.
- Servers see one IP for the whole office, so rate limits and geo-blocks hit everyone at once, and logs cannot tell agents apart. That is why web apps behind proxies rely on the `X-Forwarded-For` header.
- The mapping expires after idle time (often 30–300 s for UDP), which is why VPNs and VoIP send **keepalives**.

### Port forwarding

To run a server inside the LAN, you add a permanent inbound mapping: "anything arriving at public port 8443 goes to 192.168.1.50:443". This is **port forwarding** (also called DNAT or a virtual server in router menus).

```text
Router rule:   WAN 203.0.113.7:8443  ->  LAN 192.168.1.50:443  (TCP)
Test from outside:  curl -k https://203.0.113.7:8443/
```

**UPnP** lets applications create these mappings automatically, which is convenient for games and dangerous on an office network; disable it on anything that handles client data.

### Firewalls

A **firewall** filters packets by rules. The essential concepts:

- **Stateless** (an ACL): each packet judged alone by source, destination, protocol and port. Fast, but you must write rules for both directions.
- **Stateful**: the firewall remembers established connections and automatically allows the return traffic. Nearly every firewall today is stateful.
- **Default deny**: everything not explicitly allowed is dropped. Inbound to an office should be default deny; outbound is often allow-all in small offices and restricted in regulated ones.
- **Drop** versus **reject**: drop is silent (the client times out); reject sends an RST or ICMP unreachable (the client fails fast). External interfaces drop; internal ones may reject to make troubleshooting quicker.

```bash
# Windows Defender Firewall: allow inbound RDP from one subnet only
netsh advfirewall firewall add rule name="RDP from office" dir=in action=allow protocol=TCP localport=3389 remoteip=10.0.0.0/24
# Linux nftables / ufw
sudo ufw default deny incoming
sudo ufw allow from 10.0.0.0/24 to any port 22 proto tcp
sudo ufw enable
sudo ufw status numbered
```

Rules are evaluated top to bottom and the first match wins, so order matters: a broad deny above a narrow allow makes the allow dead.

### Where firewalls live

| Place | What it protects |
|---|---|
| Network edge | The whole site from the internet |
| Between VLANs | Agents from servers, guests from everything |
| Host (Windows Defender, ufw) | The individual machine, even from LAN neighbours |
| Cloud security groups | Each VM or service (covered in the Expert level) |
| Web application firewall (WAF) | Layer 7: SQL injection, XSS, bad bots |

A **DMZ** is a separate subnet for public-facing servers; the internet can reach the DMZ on specific ports, the DMZ can reach the inside only on specific ports, and a compromised web server therefore cannot roam the LAN.

> **Warning:** "Ping works, so the firewall is fine" is wrong. ICMP and TCP port 443 are separate rules. When a service is unreachable, test the exact port (`nc -zv host 443` or `Test-NetConnection host -Port 443`) from the exact source, because rules are usually scoped by source address as well.

### Try It Yourself

```bash
# See NAT and firewall behaviour from both sides
curl -s https://api.ipify.org          # the public IP the world sees for you (NAT outside address)
ip -4 addr show | grep inet            # your private inside address
# Linux: show live NAT mappings on the router/gateway (needs conntrack-tools)
sudo conntrack -L | head
# Test whether a specific port is reachable from outside (run on an external host or phone tethering)
nc -zv 203.0.113.7 8443
# Windows: list active firewall rules for a port
netsh advfirewall firewall show rule name=all | findstr /i "3389"
```

### Quiz

1. How does a NAT router know which inside host a reply belongs to?
- [ ] By the destination MAC address
- [x] By looking up the destination port in its translation table
- [ ] By asking DHCP
> PAT assigns a unique outside port per session and stores the mapping.

2. Which statement about a stateful firewall is true?
- [ ] It needs a rule for every reply packet
- [x] It automatically allows return traffic for connections it saw start
- [ ] It only works for UDP
> Stateful inspection tracks connections, so one "allow outbound 443" rule covers the responses.

3. Why can a home user behind CGNAT not host a game server with port forwarding?
- [ ] Their router does not support UPnP
- [x] The ISP performs a second NAT they cannot configure
- [ ] Game servers require IPv6
> Carrier-grade NAT translates at the ISP; only the ISP can create inbound mappings there.

4. Firewall rules: 1) allow TCP 443 from any, 2) deny all from 10.0.0.0/8, 3) allow TCP 22 from 10.0.0.0/24. Can 10.0.0.5 SSH in?
- [ ] Yes, rule 3 allows it
- [x] No, rule 2 matches first
- [ ] Only if it uses port 443
> First match wins; the broad deny in rule 2 shadows rule 3. Move rule 3 above it.

### Exercises

1. **Write the rules** — A scanning server `192.168.1.50` must receive SFTP uploads from the underwriter's IP `198.51.100.20` only, and nothing else from the internet. Write the port forward and firewall rule in plain text.
<details><summary>Solution</summary>

```text
Port forward: WAN 203.0.113.7:2222 (TCP) -> 192.168.1.50:22
Firewall (inbound, WAN interface, top to bottom):
  allow TCP dst 2222 from 198.51.100.20/32
  deny  all  (default)
Optional hardening: allow only key-based auth on the SFTP server, and log the allow rule.
```

</details>

2. **Explain the symptom** — A VoIP call between two offices connects but audio drops every 30 seconds for a second or two, then returns. Suggest the NAT-related cause and fix.
<details><summary>Solution</summary>

```text
The UDP NAT mapping for the RTP stream is timing out because the router's UDP timeout
(often 30 s) is shorter than the gap between packets in one direction (silence
suppression), so the mapping is deleted and rebuilt. Fix: raise the UDP timeout for the
RTP port range, enable keepalives on the phones, or use the router's SIP ALG carefully.
```

</details>

### Interview Questions

**Q: Explain NAT and the problems it causes for applications.**
NAT rewrites source addresses and ports on outbound packets so many private hosts share one public address, keeping a table to reverse the mapping on replies. It breaks the end-to-end principle: inbound connections cannot reach a private host without a pre-configured forward, so peer-to-peer apps need STUN to discover their public mapping, TURN relays when both sides are behind symmetric NAT, or ICE to try all options, which is exactly what WebRTC does. Protocols carrying addresses in their payload such as FTP and SIP need application-layer gateways, mappings time out so long-lived UDP sessions need keepalives, and everyone behind the NAT shares one reputation with external services. IPv6 removes the need, but IPv6 firewalls must then replicate the default-deny inbound behaviour people mistakenly attribute to NAT.

**Q: What is the difference between a stateful firewall and a stateless ACL, and where would you still use an ACL?**
A stateless ACL evaluates each packet in isolation against source, destination, protocol and ports, so allowing a client to reach a server on 443 requires a second rule permitting replies from port 443 back to ephemeral ports, which is coarse and easy to get wrong. A stateful firewall records each connection's 5-tuple and state in a table and automatically admits matching return traffic, allowing tight, direction-aware policy such as "outbound 443 only". ACLs remain useful where speed and simplicity dominate: on core routers filtering bogon prefixes, on cloud network ACLs as a coarse subnet-level backstop under stateful security groups, and for blocking obviously bad traffic before it consumes firewall state. In cloud interviews I point out that AWS security groups are stateful and NACLs are stateless, which is why NACLs need ephemeral-port return rules.

**Q: How would you expose an internal web application to a single external partner securely?**
I would avoid raw port forwarding to the internal host. The better options in order of preference are a VPN or zero-trust access proxy so the partner authenticates before reaching anything; if it must be public, a reverse proxy in a DMZ that terminates TLS, forwards only to the app's port, and is firewalled to the partner's source IPs; on the app, enforce authentication and log access. I would run a port scan from outside afterwards to confirm only the intended port answers, monitor the allow rule's hit counts, and set an expiry date on the exception so it is reviewed. A single port forward with no source restriction is how ransomware reaches RDP servers, and I would say so.

# LEVEL: Advanced

## TLS, certificates and how HTTPS really works

**TLS** (Transport Layer Security) is the protocol that turns HTTP into HTTPS. It provides three things: **confidentiality** (nobody on the path can read the data), **integrity** (nobody can alter it undetected) and **authentication** (you are talking to the real `bank.com`, proven by a certificate). The current version is TLS 1.3 (RFC 8446, 2018); TLS 1.2 is still widely accepted; SSL 3, TLS 1.0 and 1.1 are deprecated and should be disabled.

### Certificates and the chain of trust

A **certificate** binds a public key to a name (`www.example.com`) and is signed by a **Certificate Authority** (CA). Your OS and browser ship with about 150 trusted **root CA** certificates. Roots do not sign server certificates directly; they sign **intermediate** CAs, which sign the **leaf** certificate the server presents.

```text
Root CA (in your trust store, self-signed, 20-year validity)
  └── Intermediate CA (signed by root)
        └── Leaf: CN=www.example.com, SAN: www.example.com, example.com (signed by intermediate, 90-398 days)
```

The server must send the leaf **and** the intermediate; a missing intermediate is the most common cause of "works in Chrome, fails in curl and Python", because browsers fetch missing intermediates and libraries do not.

What the browser checks: the signature chain up to a trusted root, the validity dates, that the requested hostname matches a **SAN** (Subject Alternative Name) entry, and revocation status (OCSP, often stapled by the server). Certificates come in DV (domain validated, free from Let's Encrypt, issued in minutes), OV and EV (organisation validated, paperwork, no extra browser UI any more).

### The TLS 1.3 handshake

```text
Client                                                   Server
ClientHello: supported versions, cipher suites,   ---->
             key share (ephemeral ECDHE public key), SNI=www.example.com
                                                  <----  ServerHello: chosen suite, server key share
                                                         {Certificate, CertificateVerify, Finished}  (encrypted)
{Finished}                                        ---->
{HTTP request}                                    ---->   application data flows, 1 RTT after TCP
```

Both sides compute the same shared secret from the exchanged key shares (Elliptic-Curve Diffie-Hellman) without ever sending it. Because the keys are **ephemeral**, generated per connection, recorded traffic cannot be decrypted later even if the server's private key leaks: **forward secrecy**. TLS 1.2 needed two round trips and allowed RSA key exchange without forward secrecy; 1.3 removed that and every weak cipher.

**SNI** (Server Name Indication) is the hostname sent in cleartext in the ClientHello so one IP can host many certificates; **Encrypted Client Hello** (ECH) is the newer extension that hides it.

### Symmetric and asymmetric, in one sentence each

Asymmetric cryptography (RSA, ECDSA, ECDHE) is slow and used only for the handshake: proving identity and agreeing a key. Symmetric cryptography (AES-128-GCM, AES-256-GCM, ChaCha20-Poly1305) is fast and encrypts the actual data with the agreed key. A cipher suite name such as `TLS_AES_128_GCM_SHA256` lists the symmetric cipher and the hash used for key derivation.

### Reading a certificate from the command line

```bash
# Show the chain, the SANs, the dates and the negotiated protocol
openssl s_client -connect www.example.com:443 -servername www.example.com </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
# Just the protocol and cipher that were negotiated
openssl s_client -connect www.example.com:443 -servername www.example.com </dev/null 2>/dev/null | grep -E 'Protocol|Cipher'
# Verify a chain file locally
openssl verify -CAfile chain.pem server.crt
```

### Common failures and what they mean

| Error | Cause |
|---|---|
| `NET::ERR_CERT_DATE_INVALID` | Expired certificate, or the client's clock is wrong |
| `ERR_CERT_COMMON_NAME_INVALID` | Hostname not in the SAN list (you used the IP, or an alias) |
| `unable to get local issuer certificate` | Missing intermediate on the server or missing root on the client |
| `SSL_ERROR_RX_RECORD_TOO_LONG` | Speaking TLS to a port that is serving plain HTTP |
| `handshake_failure` | No cipher suite or protocol version in common (old client vs TLS 1.3-only server) |

**HSTS** (`Strict-Transport-Security` header) tells browsers to always use HTTPS for the domain and refuse to click through certificate errors, which closes the downgrade attack that intercepts the first plain-HTTP request.

> **Warning:** Corporate proxies that inspect HTTPS install their own root CA on every PC and re-sign each site on the fly. `openssl s_client` from an office PC will then show the proxy's issuer, not DigiCert or Let's Encrypt. Know whether your network does this before debugging a certificate "problem".

### Let's Encrypt and automation

Certificates now last 90 days or less (the industry is moving to 47 days by 2029), so renewal must be automated. The **ACME** protocol (used by certbot, acme.sh, Caddy, Traefik) proves control of a domain with an HTTP-01 challenge (serve a token at `/.well-known/acme-challenge/`) or a DNS-01 challenge (publish a TXT record, required for wildcards), then issues the certificate.

```bash
sudo certbot certonly --webroot -w /var/www/html -d portal.example.com -d www.example.com
sudo certbot renew --dry-run     # cron or systemd timer runs `certbot renew` twice daily
```

### Try It Yourself

```bash
# Inspect a real site's TLS setup end to end
HOST=www.example.com
openssl s_client -connect $HOST:443 -servername $HOST </dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
openssl s_client -connect $HOST:443 -servername $HOST -tls1_2 </dev/null 2>/dev/null | grep -E 'Protocol|Cipher'
openssl s_client -connect $HOST:443 -servername $HOST -tls1_3 </dev/null 2>/dev/null | grep -E 'Protocol|Cipher'
curl -sI https://$HOST | grep -i strict-transport   # is HSTS set?
```

### Quiz

1. What does forward secrecy guarantee?
- [ ] The certificate cannot expire
- [x] Recorded traffic cannot be decrypted later even if the server's private key leaks
- [ ] The server's identity is verified by the browser
> Ephemeral Diffie-Hellman keys are discarded after each session, so past sessions stay secret.

2. Why does a site work in Chrome but fail with "unable to get local issuer certificate" in Python?
- [ ] Python does not support TLS 1.3
- [x] The server is not sending its intermediate certificate and Chrome fetches it automatically
- [ ] The certificate is expired
> Browsers use AIA fetching to download missing intermediates; most libraries do not.

3. Which is used to encrypt the actual HTTP data after the handshake?
- [ ] RSA
- [x] A symmetric cipher such as AES-GCM
- [ ] SHA-256 alone
> Asymmetric crypto only agrees the key; bulk data uses fast symmetric encryption.

4. What does SNI carry and why does it matter?
- [x] The hostname, in cleartext, so a shared IP can serve the right certificate
- [ ] The cipher suite list
- [ ] The session cookie
> Without SNI the server would not know which certificate to present before the connection is encrypted.

### Exercises

1. **Diagnose** — A Windows PC reports every HTTPS site as "certificate not yet valid" since this morning. What do you check first?
<details><summary>Solution</summary>

```text
The PC's clock. A dead CMOS battery or a failed NTP sync sets the date back, so every
certificate's notBefore is in the "future". Run `w32tm /resync` and check the BIOS date.
```

</details>

2. **Fix the chain** — `curl https://portal.example.com` fails with "unable to get local issuer certificate" but the browser is fine. Show how to confirm and fix it on an nginx server.
<details><summary>Solution</summary>

```bash
# Confirm: the chain shown has depth 0 only (no intermediate)
openssl s_client -connect portal.example.com:443 -servername portal.example.com </dev/null 2>&1 | grep -E '^ [0-9] s:'
# Fix: nginx expects the leaf followed by the intermediates in one file
cat portal.crt intermediate.crt > fullchain.pem
# nginx.conf:  ssl_certificate /etc/ssl/fullchain.pem;  ssl_certificate_key /etc/ssl/portal.key;
sudo nginx -t && sudo systemctl reload nginx
```

</details>

### Interview Questions

**Q: Walk me through the TLS 1.3 handshake and what each step achieves.**
The client sends a ClientHello with the versions and cipher suites it supports, the SNI hostname, and an ephemeral ECDHE key share; the server answers with a ServerHello choosing the suite and adding its own key share, and from that point both derive the same handshake secret without transmitting it. The server then sends, already encrypted, its certificate chain, a CertificateVerify signature over the handshake transcript proving it holds the private key matching the certificate, and a Finished MAC; the client validates the chain against its trust store, checks the SAN matches, verifies the signature, and sends its own Finished. Application data begins after one round trip, or zero with a resumption ticket (0-RTT, which is replayable so only idempotent requests should use it). The design gives forward secrecy by construction, since no long-term key encrypts session traffic.

**Q: How does the browser know a certificate is genuine and not something an attacker generated?**
The certificate is signed by an intermediate CA whose certificate is signed by a root CA present in the browser or OS trust store; the browser verifies each signature up the chain, checks validity periods, hostname match against the SAN, key usage constraints, and revocation via OCSP stapling or CRLs. An attacker can generate a certificate for any name, but cannot obtain a trusted CA's signature for a domain they do not control, because CAs verify control through challenges and are audited, and every issued certificate is logged to public Certificate Transparency logs that Chrome requires. Trust is therefore anchored in the trust store, which is why installing a corporate or malicious root CA is such a powerful move, and why I treat root installation as a security event.

**Q: A partner's API rejects our TLS connection with handshake_failure. How do you debug it?**
I reproduce with `openssl s_client` forcing specific versions and cipher suites to find what the server accepts, and compare with what our client library offers; typical mismatches are a server that only speaks TLS 1.2 with RSA suites while our client is configured TLS 1.3-only, or a server requiring SNI that our client omits, or mutual TLS where the server wants a client certificate we are not presenting. I check whether an outbound inspecting proxy is in the path by comparing the issuer seen from the office and from an external host. If the server side is weak, I negotiate a minimum of TLS 1.2 with ECDHE suites rather than enabling anything deprecated, and document the exception with an expiry.

## Email protocols: SMTP, IMAP, POP3 and SPF, DKIM, DMARC

Email predates the web and uses three protocols: **SMTP** to send and relay, and **IMAP** or **POP3** to read. Layered on top are the authentication records, SPF, DKIM and DMARC, that decide whether your weekly production report lands in the client's inbox or their spam folder.

### The journey of one message

```text
Ali's Outlook  --SMTP submission (587, STARTTLS)-->  smtp.office365.com (his provider's MSA)
     --SMTP relay (25, STARTTLS)-->  MX server of stewart.com (the MTA that accepts for that domain)
     --> stored in the recipient's mailbox (MDA)
Recipient's client  <--IMAP (993) or POP3 (995)--  mailbox
```

Names to know: **MUA** (mail user agent: Outlook, Gmail web), **MSA** (submission agent, port 587), **MTA** (transfer agent, port 25 between servers), **MDA** (delivery agent that writes to the mailbox).

### SMTP: the conversation

SMTP is plain text and you can speak it by hand. The commands are `EHLO`, `MAIL FROM`, `RCPT TO`, `DATA`, `QUIT`.

```text
S: 220 mail.example.com ESMTP
C: EHLO laptop.lahore.local
S: 250-mail.example.com  250-STARTTLS  250-AUTH PLAIN LOGIN  250 SIZE 52428800
C: MAIL FROM:<ali@example.com>
S: 250 2.1.0 OK
C: RCPT TO:<ops@stewart.com>
S: 250 2.1.5 OK
C: DATA
S: 354 End data with <CR><LF>.<CR><LF>
C: From: Ali <ali@example.com>
C: To: ops@stewart.com
C: Subject: Weekly status - WY production
C:
C: Report attached.
C: .
S: 250 2.0.0 Queued as 4F1D2
```

Notice two "from" addresses: the **envelope sender** in `MAIL FROM` (what SPF checks) and the **header From** that the reader sees (what DMARC aligns against). Spoofing works because nothing in SMTP itself verifies either.

| Port | Use | Encryption |
|---|---|---|
| 25 | Server-to-server relay | Opportunistic STARTTLS |
| 587 | Client submission (authenticated) | STARTTLS required by most providers |
| 465 | Client submission | Implicit TLS from the first byte |
| 143 / 993 | IMAP / IMAP over TLS | |
| 110 / 995 | POP3 / POP3 over TLS | |

Reply codes follow HTTP-like classes: 2xx success, 3xx continue, 4xx temporary failure (retry later, greylisting), 5xx permanent (bad address, policy rejection). A **bounce** is a message generated when a 5xx occurs after acceptance.

### IMAP versus POP3

**POP3** downloads messages to one device and, by default, deletes them from the server. **IMAP** keeps everything on the server and syncs folders, flags and read status across all devices. Use IMAP unless you have a very specific reason; POP3 survives mostly in old scanners and legacy scripts.

### Why your report went to spam: SPF, DKIM, DMARC

Three DNS records let a receiving server verify a message really came from your domain.

**SPF** (Sender Policy Framework) is a TXT record listing which servers may send for your domain. The receiver checks the connecting server's IP against it, using the envelope sender's domain.

```text
example.com.  IN TXT  "v=spf1 ip4:203.0.113.10 include:spf.protection.outlook.com -all"
```

`-all` means hard fail for anything else; `~all` is soft fail. SPF has a limit of 10 DNS lookups, which large `include:` chains exceed.

**DKIM** (DomainKeys Identified Mail) signs the message headers and body with a private key; the public key sits in DNS at `<selector>._domainkey.example.com`. The signature survives forwarding, which SPF does not.

```text
selector1._domainkey.example.com.  IN TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkq..."
DKIM-Signature: v=1; a=rsa-sha256; d=example.com; s=selector1; h=from:to:subject; bh=...; b=...
```

**DMARC** ties them together: it says what to do when neither SPF nor DKIM passes **in alignment** with the header From domain, and where to send reports.

```text
_dmarc.example.com.  IN TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; pct=100"
```

`p=none` only monitors, `quarantine` sends failures to spam, `reject` bounces them. Roll out none, then quarantine, then reject while reading the aggregate reports. Since 2024 Gmail and Yahoo require SPF or DKIM plus DMARC for anyone sending over 5,000 messages a day.

> **Tip:** When a client says "we never got your report", ask them to search spam and then check `dig TXT example.com`, `dig TXT selector1._domainkey.example.com` and `dig TXT _dmarc.example.com` yourself. Nine times out of ten a new marketing tool started sending "from" the domain without being added to SPF and DMARC quarantined everything.

### Reading headers

Every server that handles a message adds a `Received:` header at the top, so read them bottom to top to trace the path. `Authentication-Results:` shows the receiver's SPF, DKIM and DMARC verdicts. Gmail's "Show original" and Outlook's message header view expose them.

### Try It Yourself

```bash
# Check a domain's email authentication setup
D=example.com
dig +short TXT $D | grep spf1
dig +short TXT _dmarc.$D
dig +short MX $D
# Test an SMTP server by hand (STARTTLS on 587)
openssl s_client -starttls smtp -connect smtp.office365.com:587 -crlf </dev/null 2>/dev/null | grep -E '^250|Protocol'
# Send a test message from a script with Python's standard library
python3 -c "import smtplib; s=smtplib.SMTP('smtp.office365.com',587); s.starttls(); print(s.ehlo()[0])"
```

### Quiz

1. Which port is the standard for authenticated client submission?
- [ ] 25
- [x] 587
- [ ] 143
> Port 25 is for server-to-server relay and is blocked by most ISPs for clients; 587 is the submission port.

2. Which record survives when a message is forwarded by a mailing list?
- [ ] SPF
- [x] DKIM
- [ ] Neither
> SPF checks the forwarding server's IP, which fails; a DKIM signature travels with the message.

3. What does `p=reject` in a DMARC record instruct receivers to do?
- [ ] Deliver but mark as suspicious
- [x] Refuse messages that fail both SPF and DKIM alignment
- [ ] Send a copy to the domain owner
> Reject is the strictest policy; quarantine sends to spam; none only reports.

4. Which protocol keeps mail on the server and syncs read status across devices?
- [ ] POP3
- [x] IMAP
- [ ] SMTP
> IMAP is a server-side mailbox protocol; POP3 downloads and typically deletes.

### Exercises

1. **Write the records** — Your company sends mail through Microsoft 365 and a report server at `203.0.113.10`. Write SPF and a monitoring-mode DMARC record.
<details><summary>Solution</summary>

```text
example.com.        IN TXT "v=spf1 ip4:203.0.113.10 include:spf.protection.outlook.com -all"
_dmarc.example.com. IN TXT "v=DMARC1; p=none; rua=mailto:dmarc-reports@example.com; adkim=r; aspf=r"
Then enable DKIM signing in the Microsoft 365 admin centre, which adds two CNAME selectors.
```

</details>

2. **Trace the path** — Given three `Received:` headers, in what order did the servers handle the message and which one first saw the sender's IP?
<details><summary>Solution</summary>

```text
Headers are prepended, so the bottom Received: line is the first server (the one that
accepted the message from the sender and recorded its IP), and the top line is the last
server before the mailbox. Read bottom to top for chronological order.
```

</details>

### Interview Questions

**Q: Explain SPF, DKIM and DMARC and why all three are needed.**
SPF publishes which IPs may send for a domain, but it checks the envelope sender and breaks on forwarding, and it says nothing about the From header users actually see. DKIM cryptographically signs the message with a key published in DNS, proving the content and the signing domain were not altered, and it survives forwarding, but a message with a valid DKIM signature from `attacker.com` and a From header of `bank.com` still passes DKIM. DMARC closes the gap by requiring that whichever of SPF or DKIM passes must align with the From header domain, and by giving the domain owner a policy and reporting channel. Together they let a receiver answer "is this really from this domain" and let the owner see who is spoofing them; I have used the aggregate reports to find an unlisted marketing tool that was causing a client's reports to be quarantined.

**Q: Why is port 25 usually blocked for clients, and what should an application use instead?**
Port 25 is the server-to-server relay port, and open relays plus infected home PCs sending directly on 25 were the main spam vector, so ISPs and cloud providers block outbound 25 by default; AWS and Azure require a request to unblock it. Applications should submit through port 587 with STARTTLS or 465 with implicit TLS, authenticating with credentials or OAuth to a provider's submission server, which then relays on 25 with proper SPF and DKIM. This also means the message gets the provider's reputation and DKIM signature rather than a cloud IP with no reverse DNS, which would be rejected or spam-foldered by most receivers.

**Q: A scheduled report script suddenly fails with "535 Authentication failed". What has probably changed?**
Most likely the provider disabled basic authentication: Microsoft 365 turned off basic auth for SMTP AUTH per tenant, and Google requires app passwords with two-factor or OAuth 2.0. The fix is to switch the script to OAuth 2.0 client credentials with the SMTP.Send scope, or to use the provider's REST API (Microsoft Graph sendMail, Gmail API), or to route through a transactional service such as SES or SendGrid with an API key. I would also check whether the password was rotated, whether the account is locked from a security alert, and whether the tenant now requires SMTP AUTH to be explicitly enabled on that mailbox.

## Wireless networking: Wi-Fi standards and security

Wi-Fi replaces the cable with radio, and radio changes the rules: the medium is shared, half-duplex, subject to interference, and audible to anyone within range. Understanding those four facts explains most Wi-Fi problems.

### Standards

| Marketing name | IEEE | Year | Bands | Max link rate | Notes |
|---|---|---|---|---|---|
| Wi-Fi 4 | 802.11n | 2009 | 2.4 / 5 GHz | 600 Mbps | MIMO introduced |
| Wi-Fi 5 | 802.11ac | 2013 | 5 GHz | 3.5 Gbps | 80/160 MHz channels, MU-MIMO down |
| Wi-Fi 6 | 802.11ax | 2019 | 2.4 / 5 GHz | 9.6 Gbps | OFDMA, better in dense offices |
| Wi-Fi 6E | 802.11ax | 2021 | adds 6 GHz | 9.6 Gbps | 1,200 MHz of clean spectrum |
| Wi-Fi 7 | 802.11be | 2024 | 2.4 / 5 / 6 GHz | 46 Gbps | 320 MHz channels, multi-link |

Link rate is the headline number; real throughput is roughly half, shared among everyone on the access point.

### Bands and channels

**2.4 GHz** travels further and through walls but has only three non-overlapping channels (1, 6, 11) and competes with microwaves and Bluetooth. **5 GHz** has more channels, higher speeds and shorter range. **6 GHz** is the newest, cleanest and shortest. Adjacent access points should use different channels; in a 20-agent office that means a site survey, not "auto".

```bash
# See what your adapter sees (Linux)
nmcli dev wifi list            # SSID, channel, signal, security
sudo iw dev wlan0 scan | grep -E 'SSID|freq|signal'
# Windows
netsh wlan show interfaces      # your current SSID, channel, signal %, receive rate
netsh wlan show networks mode=bssid
```

### Signal and interference

Signal strength is reported as **RSSI** in dBm: −50 is excellent, −67 is the usual minimum for voice and video, −80 is unusable. The number that matters more is **SNR** (signal-to-noise ratio); a strong signal in a noisy room still performs badly. Because the channel is shared, one laptop far from the AP negotiating a low rate slows everyone else (the "airtime" problem), which is why enterprise APs set minimum rates and push clients to 5 GHz (**band steering**).

### How a client joins

```text
1. Beacon / probe     AP announces the SSID; client probes for it
2. Authentication     legacy "open" step
3. Association        client joins the BSS (the AP's MAC is the BSSID)
4. 4-way handshake    WPA2/WPA3 key derivation from the PSK or 802.1X credentials
5. DHCP               then everything from the wired world applies
```

**SSID** is the network name; **BSSID** is the AP's MAC; several APs broadcasting the same SSID form an **ESS** and clients **roam** between them, with 802.11r speeding up the re-key.

### Security: what to use and what to avoid

| Protocol | Status | Notes |
|---|---|---|
| WEP | Broken since 2001 | Crackable in minutes; never use |
| WPA (TKIP) | Deprecated | Weak; disable |
| WPA2-Personal (AES-CCMP, PSK) | Acceptable | One shared password; anyone with it can decrypt others' traffic if they capture the handshake |
| WPA2-Enterprise (802.1X) | Good | Per-user credentials via RADIUS; certificates for the server |
| WPA3-Personal (SAE) | Best for small networks | Dragonfly handshake resists offline password guessing; forward secrecy |
| WPA3-Enterprise | Best for offices | Mandatory PMF, 192-bit mode option |

**802.1X** means the client authenticates to a **RADIUS** server (Microsoft NPS, FreeRADIUS) with EAP: **EAP-TLS** uses client certificates and is the gold standard; **PEAP-MSCHAPv2** uses AD username and password and must validate the server certificate to resist evil-twin APs. **PMF** (Protected Management Frames, 802.11w) stops deauthentication attacks that kick clients off to capture handshakes.

```text
Office design that passes an audit:
  SSID "Corp"   WPA3-Enterprise (or WPA2-Enterprise), EAP-TLS, VLAN 10, PMF required
  SSID "Guest"  WPA3-Personal or captive portal, VLAN 40, client isolation, internet only
  Hidden SSIDs: no (they leak anyway and make clients probe for them everywhere)
  MAC filtering: no (trivially spoofed; use 802.1X)
```

> **Warning:** A guest Wi-Fi that shares the office VLAN is a data-protection finding waiting to happen. Client isolation plus a separate VLAN with an internet-only firewall rule is the minimum for any office that handles client documents.

### Other wireless you will meet

**Bluetooth** (2.4 GHz, short range, PAN), **cellular** (4G LTE, 5G; the failover WAN for many offices via a USB or router modem), **Zigbee/Thread** for sensors, and **satellite** (Starlink) with 25–60 ms latency, far better than the 600 ms of geostationary links.

### Try It Yourself

```bash
# Audit the Wi-Fi you are on right now
netsh wlan show interfaces                    # Windows: Radio type (802.11ax?), Band, Channel, Signal, Authentication
netsh wlan show networks mode=bssid | findstr /i "SSID Authentication Channel Signal"
# Linux equivalent
nmcli -f SSID,CHAN,RATE,SIGNAL,SECURITY dev wifi list
# Measure real throughput to a wired host on the LAN (run `iperf3 -s` there first)
iperf3 -c 192.168.1.10 -t 10
```

### Quiz

1. Which 2.4 GHz channels do not overlap?
- [ ] 1, 5, 9
- [x] 1, 6, 11
- [ ] All of them
> Each channel is 20 MHz wide on 5 MHz spacing, so only 1, 6 and 11 are fully separate.

2. Why is WPA2-Personal weaker than WPA2-Enterprise in an office?
- [ ] It uses TKIP
- [x] Everyone shares one key, so a leaver or a captured handshake compromises all traffic
- [ ] It cannot use AES
> Enterprise mode gives each user their own credentials via 802.1X and per-session keys.

3. What does band steering do?
- [x] Pushes capable clients from 2.4 GHz to 5 GHz
- [ ] Increases transmit power
- [ ] Hides the SSID
> Moving clients to the less congested band improves airtime for everyone.

4. What does 802.11w (PMF) protect against?
- [ ] Weak passwords
- [x] Forged deauthentication frames that disconnect clients
- [ ] Rogue DHCP servers
> Management frames were unauthenticated before PMF, allowing trivial deauth attacks.

### Exercises

1. **Diagnose** — Agents near the window report "full bars but slow Wi-Fi". Suggest two likely causes and how to confirm each.
<details><summary>Solution</summary>

```text
1. Co-channel interference: a neighbouring office's AP on the same channel. Confirm with
   `netsh wlan show networks mode=bssid` showing strong foreign BSSIDs on your channel.
2. Airtime starvation: they are on 2.4 GHz with many clients, or a distant client at a low
   rate. Confirm with "Receive rate" in `netsh wlan show interfaces` and the AP's client list.
Fix: change channels after a survey, enable band steering, set a minimum basic rate.
```

</details>

2. **Design** — Specify SSIDs, security modes and VLANs for a 30-person title office with visiting notaries.
<details><summary>Solution</summary>

```text
"TitleCorp"   WPA3-Enterprise (fallback WPA2-Enterprise), EAP-TLS with device certs, VLAN 10, PMF required
"TitleGuest"  WPA3-Personal with a rotating password or captive portal, VLAN 40, client isolation,
              firewall: VLAN 40 -> internet only, bandwidth cap 20 Mbps per client
Channels planned from a survey; 5 GHz preferred; 2.4 GHz only on channels 1/6/11.
```

</details>

### Interview Questions

**Q: Why is Wi-Fi slower than the link rate on the box, and what actually determines throughput?**
The advertised rate is the peak physical-layer rate for one client, close to the AP, with the widest channel and maximum spatial streams. Real throughput loses about half to protocol overhead and acknowledgements, then is shared among all clients on the channel because Wi-Fi is half-duplex CSMA/CA, so only one station transmits at a time. It degrades further with distance (lower modulation), interference from neighbouring networks on the same channel, and slow clients that hog airtime. Throughput is therefore determined by SNR, channel width, the number of active clients and the slowest active client, not by the number printed on the router, and the highest-impact fixes are AP placement, channel planning and moving clients to 5 or 6 GHz.

**Q: How would you secure the wireless network of an office that handles client financial documents?**
Corporate access via WPA2/WPA3-Enterprise with 802.1X, preferably EAP-TLS using device certificates issued by the company CA, so credentials cannot be phished and a lost laptop can be revoked individually; Protected Management Frames enabled; a separate guest SSID on its own VLAN with client isolation and internet-only firewall rules; rogue AP detection on the controller; and no MAC filtering or hidden SSIDs, which add hassle without security. I would log 802.1X authentications to the SIEM, review them for evil-twin symptoms such as repeated server-certificate failures, and combine it with the wired policy so a device is treated identically on cable or Wi-Fi. If I inherited WPA2-Personal, rotating the key on every departure is the interim control while 802.1X is rolled out.

**Q: What is an evil-twin attack and which configuration defeats it?**
An attacker broadcasts an SSID identical to the office's with a stronger signal, and clients configured to auto-join connect to it; on PSK networks the attacker then runs a captive portal to harvest the password, and on badly configured PEAP networks the client sends its MSCHAPv2 hash to the attacker's RADIUS server, which can be cracked offline. The defence is 802.1X with server certificate validation enforced on the client (the supplicant profile pins the RADIUS server's certificate and CA and refuses others), or better EAP-TLS where there is no password to steal; PMF prevents the attacker from deauthenticating clients from the real AP first. Mobile device management pushes these profiles so users never see a prompt they could click through.

## Network troubleshooting tools: ping, traceroute, nslookup, netstat, curl and Wireshark

Troubleshooting is a method, not a bag of commands. Work up the layers, change one thing at a time, and write down what you saw. This chapter gives you the commands and the reading of their output.

### The method

```text
1. Define the symptom precisely: who, what host, what URL, since when, error text.
2. Is it one user, one site, or everyone?  (scope)
3. Layer 1-2: link up? correct VLAN?           ip link / netsh interface show interface
4. Layer 3: address, gateway reachable?         ipconfig, ping <gateway>, ping 1.1.1.1
5. Name resolution?                             nslookup / dig
6. Transport: port open?                        nc -zv / Test-NetConnection
7. Application: what does the server say?       curl -v, logs
8. Path and latency?                            traceroute / mtr
9. When all else fails: capture packets.        tcpdump / Wireshark
```

### ping

`ping` sends ICMP Echo Requests and reports round-trip time and loss. `-c 4` (Linux/macOS) or `-n 4` (Windows) limits the count; `-t` on Windows runs continuously.

```text
$ ping -c 4 1.1.1.1
64 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=18.2 ms
...
4 packets transmitted, 4 received, 0% packet loss, rtt min/avg/max/mdev = 17.9/18.4/19.1/0.4 ms
```

Read: loss (any is bad on a LAN), average RTT, and **jitter** (the mdev). "Destination host unreachable" from your own IP means no route or no ARP reply; "Request timed out" means the packet left but nothing came back.

### traceroute and mtr

`traceroute` (Windows: `tracert`) shows each router on the path by sending probes with increasing TTL. Use `-n` (`-d` on Windows) to skip reverse DNS, which is slow. Linux traceroute uses UDP by default; `-I` uses ICMP and `-T` uses TCP, which passes firewalls that block the others.

`mtr` combines ping and traceroute, sending continuously and showing loss per hop. Loss that starts at one hop and **continues** to the destination is real; loss at a single middle hop that disappears at later hops is just that router rate-limiting ICMP.

```bash
mtr -n -r -c 50 portal.example.com     # report mode, 50 cycles, numeric
```

### nslookup and dig

Covered in the DNS chapter; the habits to keep are: query a specific server (`nslookup name 1.1.1.1`) to separate "my resolver" from "DNS itself", ask for the specific record type, and read TTLs.

### netstat and ss

Show sockets: which ports are listening and which connections exist.

```bash
ss -tulpn                       # Linux: TCP/UDP listeners with process names (needs root for -p)
ss -tan state established | wc -l
netstat -ano                    # Windows: all connections with PID; then tasklist /fi "PID eq 1234"
netstat -anob                   # Windows, run as admin: includes the executable name
```

A service "not responding" that is absent from the LISTEN list is not a network problem; it is not running.

### curl

`curl` speaks HTTP (and FTP, SMTP, IMAP and more) and shows you exactly what the server does, without a browser's caching and retries.

```bash
curl -v https://portal.example.com/ 2>&1 | grep -E '^(<|>|\*)'     # request, response, TLS details
curl -sS -o /dev/null -w 'dns:%{time_namelookup} tcp:%{time_connect} tls:%{time_appconnect} ttfb:%{time_starttransfer} total:%{time_total} code:%{http_code}\n' https://portal.example.com/
curl --resolve portal.example.com:443:203.0.113.5 https://portal.example.com/   # test a new server before DNS changes
curl -x http://proxy.corp:8080 -I https://example.com/                          # through a proxy
```

The `-w` timing line is the fastest way to say whether slowness is DNS, TCP, TLS or the application (time to first byte).

### tcpdump and Wireshark

When the tools above disagree with the server's logs, look at the packets. `tcpdump` captures on the command line; **Wireshark** captures and decodes with a GUI. Capture to a file with a filter, then open it in Wireshark.

```bash
sudo tcpdump -i eth0 -n -w capture.pcap 'host 203.0.113.5 and port 443'
sudo tcpdump -i any -n 'port 53'                   # watch DNS live
sudo tcpdump -i any -n 'tcp[tcpflags] & (tcp-syn) != 0 and not src net 10.0.0.0/8'   # inbound SYNs
```

Wireshark display filters you will use every week:

| Filter | Shows |
|---|---|
| `ip.addr == 10.0.0.5` | Everything to or from that host |
| `tcp.port == 443 && tcp.flags.syn == 1` | Connection attempts |
| `tcp.analysis.retransmission` | Loss on the path |
| `dns.flags.rcode != 0` | DNS errors (NXDOMAIN, SERVFAIL) |
| `http.response.code >= 500` | Server errors (plain HTTP only) |
| `tls.handshake.type == 1` | ClientHello, including SNI |

Right-click a packet and choose **Follow > TCP Stream** to read a whole conversation. **Statistics > Conversations** finds the top talkers. Retransmissions and duplicate ACKs mean loss; long gaps between a request and its response mean the server, not the network.

> **Interview note:** Interviewers ask "a user says the site is slow; what do you do?" The answer they want is the curl `-w` timing breakdown to localise the delay, mtr to check the path, and a packet capture to distinguish network loss from server think-time. Naming the tool and the exact field you read is what earns the points.

### Try It Yourself

```bash
# A complete first-response script for "the portal is down"
H=portal.example.com
ip -br addr; ip route | head -3
ping -c 3 $(ip route | awk '/default/ {print $3; exit}')
ping -c 3 1.1.1.1
dig +short $H
nc -zv $H 443
curl -sS -o /dev/null -w 'dns:%{time_namelookup}s tcp:%{time_connect}s tls:%{time_appconnect}s ttfb:%{time_starttransfer}s code:%{http_code}\n' https://$H/
mtr -n -r -c 20 $H
```

### Quiz

1. In `mtr`, loss at hop 4 only, with 0% at hops 5–10, means:
- [ ] The path is broken at hop 4
- [x] Hop 4 rate-limits ICMP replies; traffic passes fine
- [ ] DNS is failing
> Real loss persists to every later hop; isolated loss at one hop is cosmetic.

2. Which `curl -w` variable isolates server processing time?
- [ ] `time_connect`
- [x] `time_starttransfer` minus `time_appconnect`
- [ ] `time_namelookup`
> Time to first byte after the TLS handshake finishes is what the server spent thinking.

3. Which Wireshark filter shows packet loss on a TCP connection?
- [x] `tcp.analysis.retransmission`
- [ ] `ip.ttl < 64`
- [ ] `tcp.flags.syn == 1`
> Retransmissions (and duplicate ACKs) are TCP's reaction to lost segments.

4. `ss -tln` does not list port 8080. What does that mean?
- [ ] The firewall blocks 8080
- [x] Nothing on this machine is listening on 8080
- [ ] The port is in TIME_WAIT
> Listeners appear regardless of firewall rules; if it is absent, the service is not running or bound elsewhere.

### Exercises

1. **Read the timings** — `curl -w` shows `dns:0.002 tcp:0.231 tls:0.470 ttfb:3.9 total:4.1`. Where is the time going and what do you check?
<details><summary>Solution</summary>

```text
DNS and TCP are normal for a 230 ms RTT; TLS adds one more RTT as expected.
3.4 seconds pass between the TLS handshake and the first byte: the server is slow to
respond. Check application logs, database query times and CPU on the server, not the network.
```

</details>

2. **Write the capture** — Capture only DNS traffic and inbound RDP connection attempts to this host, saving to a file for Wireshark.
<details><summary>Solution</summary>

```bash
sudo tcpdump -i any -n -w dns-rdp.pcap '(udp port 53) or (tcp dst port 3389 and tcp[tcpflags] & tcp-syn != 0)'
# Open in Wireshark; filter: dns.flags.rcode != 0  or  tcp.port == 3389 && tcp.flags.syn == 1
```

</details>

3. **Order the steps** — A remote agent says "nothing works". Give the five commands you have them run, in order, and what each proves.
<details><summary>Solution</summary>

```text
1. ipconfig /all            proves address, gateway, DNS (169.254 = DHCP failure)
2. ping <gateway>           proves the LAN and router are up
3. ping 1.1.1.1             proves internet routing works
4. nslookup portal.example.com   proves DNS works
5. curl -I https://portal.example.com   proves TCP 443, TLS and HTTP work
The first failing step names the layer to fix.
```

</details>

### Interview Questions

**Q: A user reports that a web application is slow. Walk me through your diagnosis.**
I start by scoping: one user or many, one application or all, and when it started. Then I measure rather than guess: a `curl -w` timing breakdown from the user's network tells me whether the delay is DNS, TCP connect (path latency), TLS, or time to first byte (server side); an `mtr` to the server shows path loss and where latency jumps; and the browser's DevTools waterfall shows whether one slow API call or many small requests dominate. If time to first byte is the issue I move to the server: application logs, slow query log, CPU and memory; if connect times are high or mtr shows loss persisting to the destination, it is the network and I escalate with the trace. I end with a packet capture if the two sides disagree, because retransmissions in the capture settle "network versus application" objectively.

**Q: What is the difference between how traceroute works on Linux and Windows, and why does it matter?**
Both send probes with TTL starting at 1 and increasing, relying on each router's ICMP Time Exceeded reply to reveal its address. Windows `tracert` sends ICMP Echo Requests; Linux `traceroute` sends UDP packets to high ports by default and treats an ICMP Port Unreachable from the destination as completion, with `-I` for ICMP and `-T` for TCP SYN probes. It matters because firewalls filter these differently: a path that blocks UDP high ports shows stars on Linux but works on Windows, and a TCP trace to port 443 is the most faithful reproduction of what the user's browser experiences. I also note that the returned path is forward-only and that stars in the middle with a responding destination are harmless.

**Q: When would you reach for Wireshark rather than curl or logs?**
When the tools disagree: the server log says it responded in 20 ms but the client saw 3 seconds, the application says "connection reset" but nobody knows who sent the RST, or a transfer stalls at exactly the same size every time, which smells like MTU. A capture on both ends shows retransmissions, zero-window events from a slow receiver, the TLS alert that explains a handshake failure, or the ICMP fragmentation-needed message being dropped. I capture with a tight filter to a file, use the expert info and TCP stream graphs, and compare timestamps across the two captures. I avoid it as a first step because it is slow to interpret and, on production hosts, captures sensitive data that must be handled carefully.

## Application protocols: FTP and SFTP, SSH, WebSockets

Beyond HTTP and email, a handful of application protocols carry most of the operational work in a document-production shop: moving files, logging in to servers, and pushing live updates to browsers.

### FTP, FTPS and SFTP: three different things

| Protocol | Port | Transport | Encryption | Firewall friendliness |
|---|---|---|---|---|
| FTP | 21 control + data channel | TCP | None; passwords in cleartext | Poor (two connections, active/passive modes) |
| FTPS | 21 or 990 + data channel | TCP + TLS | TLS | Poor; data ports must be opened in a range |
| SFTP | 22 | SSH | SSH encryption | Excellent; one connection |

Plain **FTP** should not carry anything you would not shout across a room. Its two-connection design also causes endless firewall trouble: in **active** mode the server connects back to the client (blocked by NAT); in **passive** mode the client opens a second connection to a random high port the server announces (must be allowed through the server's firewall). **FTPS** is FTP with TLS and inherits the port problem. **SFTP** is not FTP at all; it is a file-transfer subsystem inside SSH, single port, encrypted, and the default for exchanging documents with underwriters and clients.

```bash
sftp -i ~/.ssh/id_ed25519 ali@files.underwriter.com
sftp> put weekly-status-WY.xlsx /inbound/
sftp> ls -l /outbound/
# Scripted, non-interactive
sftp -b batch.txt ali@files.underwriter.com        # batch.txt contains put/get lines
scp report.pdf ali@server:/var/reports/             # copy over SSH
rsync -avz --partial ./scans/ ali@server:/data/scans/   # resumable, only changed files
```

Python's `paramiko` and `pysftp`, and WinSCP with `/script` on Windows, automate the same operations.

### SSH: the administrator's protocol

**SSH** (Secure Shell, TCP 22) gives an encrypted terminal, file transfer and tunnelling. The handshake negotiates keys with Diffie-Hellman, then authenticates the **server** by its host key and the **user** by password or, preferably, a key pair.

```bash
ssh-keygen -t ed25519 -C "ali@laptop"         # creates ~/.ssh/id_ed25519 (private) and .pub
ssh-copy-id ali@server                        # appends the public key to ~/.ssh/authorized_keys on the server
ssh ali@server                                # logs in without a password
ssh -J bastion.example.com ali@10.0.5.20      # jump through a bastion host
```

The first connection prompts you to accept the server's **host key fingerprint**; it is stored in `~/.ssh/known_hosts`, and a later "REMOTE HOST IDENTIFICATION HAS CHANGED" warning means the server was rebuilt or someone is intercepting. Verify before accepting.

Hardening a server: `PasswordAuthentication no`, `PermitRootLogin no`, keys only, `fail2ban` or rate-limiting, move the port only if you want fewer log lines (it is not security), and restrict source IPs at the firewall.

### SSH tunnels

Port forwarding through SSH is the quickest secure path to an internal service.

```bash
# Local forward: my localhost:15432 -> (via server) -> db.internal:5432
ssh -L 15432:db.internal:5432 ali@bastion.example.com
# Remote forward: expose my local 8080 on the server's port 9090
ssh -R 9090:localhost:8080 ali@server
# Dynamic: a SOCKS proxy on localhost:1080; point the browser at it
ssh -D 1080 ali@bastion.example.com
```

Interviewers like the local-forward example: a database that only listens on the private network becomes reachable from your laptop with no firewall change and full encryption.

### WebSockets: two-way channels for browsers

HTTP is request-response; the server cannot speak first. **WebSockets** (RFC 6455) start as an HTTP request with `Upgrade: websocket`, get a `101 Switching Protocols` reply, and then the same TCP connection carries framed messages in both directions for as long as it stays open. `ws://` is plain, `wss://` runs over TLS on port 443, which passes every firewall that allows HTTPS.

```text
GET /live HTTP/1.1
Host: dashboard.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
```

Use them for live dashboards (a production queue count that updates as agents complete items), chat, collaborative editing and trading screens. Alternatives: **Server-Sent Events** (one-way server-to-browser over plain HTTP, simpler, auto-reconnects) and **long polling** (the client asks and the server holds the request until there is news). Load balancers must support the upgrade and sticky sessions, and idle timeouts (often 60 s on proxies) require periodic ping frames.

> **Tip:** If a WebSocket connects but drops every 60 seconds in production while working locally, the reverse proxy's idle timeout is closing it. Send a ping frame every 30 seconds, or raise `proxy_read_timeout` in nginx.

### Other protocols in one line each

**NTP** (UDP 123) keeps clocks in sync, without which TLS and logs break. **SNMP** (UDP 161) lets monitoring tools read counters from switches and printers. **SMB** (TCP 445) is Windows file sharing; never expose it to the internet. **RDP** (TCP 3389) is Windows remote desktop; put it behind a VPN or gateway. **LDAP/LDAPS** (389/636) is directory lookup, the protocol behind Active Directory authentication.

### Try It Yourself

```bash
# SSH key setup, an SFTP transfer and a WebSocket handshake by hand
ssh-keygen -t ed25519 -f ~/.ssh/demo_key -N ""
ssh-keygen -lf ~/.ssh/demo_key.pub             # show the fingerprint you would verify
sftp -i ~/.ssh/demo_key -P 22 user@files.example.com <<'EOS'
ls
EOS
# Open a WebSocket with curl (8.x) or websocat
curl --include --no-buffer -H "Connection: Upgrade" -H "Upgrade: websocket" \
     -H "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" -H "Sec-WebSocket-Version: 13" \
     https://echo.websocket.org/
```

### Quiz

1. Which protocol is SFTP built on?
- [ ] FTP with TLS
- [x] SSH
- [ ] HTTP
> SFTP is the SSH File Transfer Protocol, a subsystem of SSH on port 22; FTPS is FTP over TLS.

2. Why does passive-mode FTP need extra firewall rules on the server?
- [ ] It uses UDP
- [x] The data connection goes to a random high port the server announces
- [ ] It requires port 22
> The control channel is port 21 but each transfer opens a new connection on a port from the passive range.

3. What does `ssh -L 15432:db.internal:5432 bastion` do?
- [x] Makes the remote database reachable on your local port 15432 through an encrypted tunnel
- [ ] Opens port 15432 on the bastion for everyone
- [ ] Copies the database to your laptop
> A local forward listens on your machine and relays through the SSH connection to the target.

4. What HTTP status confirms a WebSocket upgrade?
- [ ] 200 OK
- [x] 101 Switching Protocols
- [ ] 307 Temporary Redirect
> The handshake is an HTTP request that the server accepts by switching protocols on the same connection.

### Exercises

1. **Choose and justify** — An underwriter wants scanned deeds uploaded nightly. They offer FTP, FTPS and SFTP. Choose, and list the client-side automation you would build.
<details><summary>Solution</summary>

```text
SFTP: single encrypted port 22, key-based auth, no NAT problems.
Automation: ed25519 key pair registered with the underwriter; a scheduled script using
paramiko (or WinSCP /script) that uploads to /inbound/YYYY-MM-DD/, verifies size and
SHA-256 after upload, writes a manifest, and emails a summary; retries with backoff; logs.
```

</details>

2. **Explain the warning** — On connecting, SSH prints "WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!". What are the two possible explanations and what do you do?
<details><summary>Solution</summary>

```text
Either the server was reinstalled or its host keys regenerated (benign), or a device
in the path is impersonating the server (attack). Do not just delete the known_hosts
line. Confirm the new fingerprint through another channel (the admin, console, or the
provider's dashboard), then update known_hosts with `ssh-keygen -R host` and reconnect.
```

</details>

### Interview Questions

**Q: Compare WebSockets, Server-Sent Events and long polling for a live production dashboard.**
Long polling keeps HTTP semantics: the browser requests, the server holds the request until data changes or a timeout, and the browser immediately asks again; it works through every proxy but costs a request per update and adds latency. Server-Sent Events use one long-lived HTTP response streaming `text/event-stream`, with automatic reconnection and event IDs built into the browser API, ideal for one-way feeds such as queue counts, but they cannot send from client to server and HTTP/1.1 limits connections per host. WebSockets give a full-duplex, low-overhead channel suited to interactive features, at the cost of needing proxy support for the upgrade, explicit reconnection logic and keepalive pings. For a dashboard that only displays, I would choose SSE for simplicity and fall back to polling; for a screen where supervisors reassign work live, WebSockets.

**Q: How does SSH authenticate the server, and why is that the part people get wrong?**
The server presents its host public key during key exchange and proves possession by signing the exchange hash; the client compares the key to its `known_hosts` entry and, on first contact, asks the user to confirm the fingerprint. People get it wrong by accepting the fingerprint blindly, which lets a man-in-the-middle capture the first session, and by deleting the known_hosts line when it changes instead of verifying why. Proper practice distributes host keys out of band, through configuration management, SSH certificates signed by an organisational CA, or DNS SSHFP records, so clients never see the prompt. User authentication with keys is well understood; server authentication is the half that keeps the encryption meaningful.

**Q: Why is SFTP preferred over FTPS, given both are encrypted?**
SFTP runs entirely inside one SSH connection on port 22, so firewalls and NAT handle it trivially, key-based authentication is native, and the same credentials and tooling serve shell access, scp and rsync. FTPS keeps FTP's separate control and data connections, so passive data ports must be opened in a range on the server firewall and the TLS session on the data channel complicates inspection and NAT helpers; explicit versus implicit modes add client compatibility issues. FTPS still appears where legacy mainframe or EDI systems mandate it and where X.509 certificate authentication is required by policy, so I support it when a partner insists, but I default to SFTP and document the port-range rules when FTPS is unavoidable.

# LEVEL: Expert

## Congestion control and performance: latency, bandwidth, HTTP/2, HTTP/3 and QUIC

Performance questions separate people who have read about networks from people who have measured them. This chapter gives you the models and the numbers.

### The two budgets: bandwidth and latency

A transfer's time is roughly `latency cost + size / bandwidth`. For a 20 KB API response over a 100 Mbps link the size term is 1.6 ms; the latency term is one RTT for TCP, one or two for TLS, one for the request itself: at 230 ms RTT that is 700 ms before the first byte. Most web performance work is therefore about **reducing round trips**, not buying bandwidth.

```text
Lahore -> Dallas, RTT 230 ms, new HTTPS connection, HTTP/1.1
TCP handshake           1 RTT   230 ms
TLS 1.3 handshake       1 RTT   230 ms   (TLS 1.2: 2 RTT)
HTTP request/response   1 RTT   230 ms
First byte at           ~690 ms  + server time
Reused keep-alive connection: 230 ms
```

**Bandwidth-delay product** (BDP) is bandwidth × RTT, the amount of data that must be in flight to fill the pipe. 100 Mbps × 0.23 s = 2.9 MB. A TCP connection whose window is smaller than the BDP cannot use the link, which is why default socket buffers must be raised for long-fat networks.

### Congestion control

TCP has no map of the network; it discovers capacity by sending more until packets drop. The classic algorithm, **CUBIC** (Linux default since 2006), grows the congestion window and halves it on loss. That works when loss means congestion, but on wireless links loss is often noise, and CUBIC then starves the connection. **BBR** (Google, 2016; BBRv3 in progress) instead estimates the bottleneck bandwidth and minimum RTT and paces packets to match, ignoring random loss and refusing to fill router buffers, which fixes **bufferbloat**, the seconds of queueing delay a full buffer adds.

```bash
sysctl net.ipv4.tcp_congestion_control          # cubic or bbr
sudo sysctl -w net.ipv4.tcp_congestion_control=bbr
sysctl net.ipv4.tcp_rmem net.ipv4.tcp_wmem      # min default max socket buffers (bytes)
```

Phases you should be able to name: **slow start** (window doubles each RTT from a small initial window, 10 segments since 2013), **congestion avoidance** (linear growth), **fast retransmit** on three duplicate ACKs, and **fast recovery**. **ECN** (Explicit Congestion Notification) lets routers mark packets instead of dropping them.

### Head-of-line blocking and why HTTP kept changing

HTTP/1.1 processes one request per connection at a time, so browsers open six parallel connections per host and developers concatenated files and sprited images to reduce requests. **HTTP/2** (2015) multiplexes all requests over one TCP connection as interleaved binary frames, compresses headers with HPACK, and lets servers prioritise streams. It removed the application-level head-of-line blocking, but TCP's own remained: one lost packet stalls **every** stream on the connection until it is retransmitted, because TCP delivers bytes in order.

**HTTP/3** (2022) fixes that by replacing TCP with **QUIC** (RFC 9000), a transport built on UDP in user space:

| Property | TCP + TLS 1.3 + HTTP/2 | QUIC + HTTP/3 |
|---|---|---|
| Handshake to first byte | 2 RTT (1 TCP + 1 TLS) | 1 RTT, 0 RTT on resumption |
| Loss on one stream | Blocks all streams | Blocks only that stream |
| Encryption | TLS layered on top | Built in; headers encrypted too |
| Connection identity | 4-tuple; breaks on Wi-Fi to 4G switch | Connection ID; survives IP change |
| Deployment | Kernel TCP | User-space library; updates ship with the browser |
| Middlebox issues | Well understood | Some networks block UDP 443; falls back to HTTP/2 |

Servers advertise HTTP/3 with an `Alt-Svc: h3=":443"` header or an HTTPS DNS record. About a third of web traffic uses it today, mostly to Google, Cloudflare and Meta.

```bash
curl --http2 -sI https://www.cloudflare.com/ | head -1     # HTTP/2 200
curl --http3 -sI https://www.cloudflare.com/ | head -1     # needs a curl built with quiche or ngtcp2
```

### Measuring, not guessing

| Metric | Tool | What good looks like |
|---|---|---|
| RTT and jitter | `ping`, `mtr` | Local < 5 ms, same continent < 80 ms, intercontinental 150–300 ms, jitter < 10% of RTT |
| Throughput | `iperf3`, large download | Within 10% of link rate on a LAN; single TCP stream on a WAN limited by window/RTT |
| Loss | `mtr`, Wireshark retransmissions | 0% on wired LAN; < 0.1% on a WAN |
| Page timing | browser DevTools, `curl -w` | TTFB under 200 ms from the same region |
| Bufferbloat | Waveform test, `flent` | Latency under load rises < 30 ms |

`iperf3 -c server -P 8` runs eight parallel streams and shows whether the limit is the link or one stream's window. Always test in both directions.

### Practical wins, in order of payoff

1. Reuse connections (keep-alive, connection pooling in every HTTP client; a new TLS connection per API call is the most common self-inflicted wound).
2. Put the server near the users, or use a CDN edge, because nothing beats a shorter RTT.
3. Enable HTTP/2 or HTTP/3 and TLS 1.3 with session resumption.
4. Compress (Brotli or gzip for text; do not recompress JPEG/PDF) and cache with correct headers.
5. Reduce request count and payload size only after the above.

> **Interview note:** "Would a 1 Gbps line make our Texas RDP session faster?" No: RDP is latency-bound, and the 230 ms is set by physics and the submarine cable route. The honest fixes are moving the session host closer to the user, or moving the user's work closer to the data.

### Try It Yourself

```bash
# Measure where the time goes for a new connection versus a reused one
H=https://www.cloudflare.com/
curl -sS -o /dev/null -w 'new:   tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} proto=%{http_version}\n' $H
curl -sS -o /dev/null -o /dev/null -w 'reuse: tcp=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer}\n' $H $H
# Throughput with 1 and 8 streams against a public iperf3 server (or your own)
iperf3 -c iperf.he.net -t 10
iperf3 -c iperf.he.net -t 10 -P 8
# Bandwidth-delay product for your link (bits per second * seconds / 8 = bytes)
python3 -c "print(100e6 * 0.230 / 8 / 1e6, 'MB in flight needed')"
```

### Quiz

1. What is the bandwidth-delay product of a 1 Gbps link with 100 ms RTT?
- [ ] 1.25 MB
- [x] 12.5 MB
- [ ] 125 MB
> 1e9 bits/s x 0.1 s = 1e8 bits = 12.5 MB, which the TCP window must cover to fill the pipe.

2. What problem does HTTP/3 solve that HTTP/2 could not?
- [ ] Header compression
- [x] TCP head-of-line blocking across multiplexed streams after a lost packet
- [ ] Multiple requests per connection
> QUIC delivers each stream independently, so one lost packet stalls only its own stream.

3. Why does BBR perform better than CUBIC on lossy wireless links?
- [x] It models bandwidth and RTT rather than treating every loss as congestion
- [ ] It uses larger packets
- [ ] It disables retransmission
> CUBIC halves its window on any loss; BBR paces to the estimated bottleneck rate.

4. Which change most reduces the time to first byte for an API called 500 times a day from Lahore to Dallas?
- [ ] Upgrading the office line from 100 Mbps to 1 Gbps
- [x] Reusing one keep-alive HTTPS connection instead of opening a new one per call
- [ ] Enabling gzip on the responses
> Each new connection costs two round trips at 230 ms; reuse removes them entirely.

### Exercises

1. **Size the buffers** — A backup runs from Lahore to a Frankfurt server over a 200 Mbps line with 140 ms RTT and is stuck at 15 Mbps. Compute the BDP and the socket buffer you would set.
<details><summary>Solution</summary>

```text
BDP = 200e6 * 0.140 / 8 = 3.5 MB.
15 Mbps implies an effective window of 15e6 * 0.14 / 8 = 262 KB, the classic default.
Set net.ipv4.tcp_rmem and tcp_wmem max to at least 8 MB (2x BDP for headroom),
confirm window scaling is on (net.ipv4.tcp_window_scaling = 1), and use a tool that
opens multiple streams if the single-stream limit remains.
```

</details>

2. **Explain the trade** — A client wants HTTP/3 enabled "for speed". List two situations where it will not help or will hurt.
<details><summary>Solution</summary>

```text
1. Corporate networks that block UDP 443: clients fall back to HTTP/2 after a timeout,
   adding delay unless Alt-Svc caching and fast fallback are working.
2. Server CPU: QUIC runs in user space without kernel offloads (no TSO/GRO for UDP on
   older kernels), so throughput per core drops; on a LAN with negligible loss and RTT,
   HTTP/2 is as fast and cheaper.
```

</details>

### Interview Questions

**Q: Explain TCP slow start and why the initial congestion window matters for web performance.**
A new connection has no knowledge of the path, so TCP starts with a small congestion window, historically 2–4 segments and 10 since RFC 6928, and doubles it every RTT until loss or the slow-start threshold. With a 10-segment start about 14 KB can be sent in the first RTT, which is why performance guides say "keep the critical HTML under 14 KB": anything larger costs an extra round trip before the browser can begin rendering. On a 230 ms path a 100 KB response needs about four RTTs just for the window to grow, nearly a second, independent of bandwidth. This is also why connection reuse matters: an established connection keeps its grown window, and why CDNs and some servers tune a larger initial window for known-good paths.

**Q: What is bufferbloat and how do you detect and fix it?**
Bufferbloat is excessive queueing delay caused by oversized router or modem buffers: when a link saturates, packets wait in the queue instead of being dropped promptly, so latency for everyone rises from 20 ms to hundreds of milliseconds even though no packet is lost, and TCP's loss-based congestion control never gets the signal to slow down. You detect it by measuring latency while the link is idle and again during a saturating upload or download; a rise of more than a few tens of milliseconds is bloat, and tools like the Waveform test grade it. The fix is active queue management on the bottleneck router, fq_codel or CAKE on Linux-based routers and OpenWrt, or SQM shaping just below the ISP rate, plus BBR on senders you control. I have seen a whole office's RDP sessions become unusable during a nightly backup upload, and shaping fixed it without buying bandwidth.

**Q: Why did QUIC choose UDP instead of being a new IP protocol number?**
Because the internet's middleboxes, NATs, firewalls and load balancers only understand TCP and UDP; a new IP protocol number would be dropped by most of them, as happened to SCTP. UDP gives QUIC a passable substrate while everything else, reliability, congestion control, stream multiplexing and TLS 1.3 integration, is implemented in user space, which lets Google and browser vendors ship improvements in weeks rather than waiting years for operating-system kernels. The costs are higher CPU per byte, the need for UDP 443 to be open with fallback to TCP when it is not, and harder network-level troubleshooting because almost every header is encrypted. Connection IDs rather than 4-tuples also give it connection migration across networks, something TCP structurally cannot do.

## CDNs, load balancing and caching

Serving one site to users on five continents from one server in Virginia gives everyone else a 150–300 ms RTT and a single point of failure. **CDNs**, **load balancers** and **caches** are the three mechanisms that make global services fast and resilient, and interviewers expect you to place each one on a diagram.

### Content Delivery Networks

A CDN puts servers (**edges** or **PoPs**, points of presence) in hundreds of cities. Users connect to the nearest edge, which serves cached content directly and forwards cache misses to your **origin**. Cloudflare, Akamai, Fastly, CloudFront and Google Cloud CDN are the names to know.

```text
Browser in Lahore --(8 ms)--> CDN edge in Karachi --cache miss--> origin in Virginia (230 ms)
Browser in Lahore --(8 ms)--> CDN edge in Karachi --cache HIT: served locally
```

Two ways users find the nearest edge. **DNS-based**: the CDN's authoritative servers return a different IP based on the resolver's location (which is why using a far-away public resolver can send you to the wrong edge; EDNS Client Subnet mitigates this). **Anycast**: the same IP is announced via BGP from every PoP, and internet routing delivers packets to the topologically nearest one; Cloudflare's `1.1.1.1` works this way.

What CDNs cache: images, CSS, JavaScript, fonts, PDFs, videos, and, with care, API responses and HTML. What they add beyond caching: TLS termination close to the user (the expensive handshake happens over an 8 ms path), HTTP/3, DDoS absorption, a WAF, image optimisation and edge compute (Cloudflare Workers, Lambda@Edge).

### Cache keys, TTLs and invalidation

The cache key is normally the full URL plus the headers listed in `Vary`. Static assets should be **fingerprinted** (`app.3f9c2a.js`) and cached for a year with `Cache-Control: public, max-age=31536000, immutable`; HTML gets a short TTL or `no-cache` with ETag revalidation. **Purge** APIs invalidate a URL or a tag immediately when you cannot wait for TTL.

```text
Cache-Control: public, max-age=300, s-maxage=3600, stale-while-revalidate=600
  max-age      browser may reuse for 5 minutes
  s-maxage     the CDN may reuse for 1 hour
  stale-while-revalidate  serve the old copy while fetching a fresh one in the background
Response header from the edge:  cf-cache-status: HIT   (or MISS, EXPIRED, BYPASS, DYNAMIC)
```

Cache hit ratio is the KPI; a 95% hit ratio means the origin sees 5% of the traffic.

### Load balancers

A load balancer distributes requests across several backend servers and removes failed ones. Two families:

| | Layer 4 | Layer 7 |
|---|---|---|
| Looks at | IP and TCP/UDP headers | HTTP: URL, host, headers, cookies |
| Speed | Very fast, hardware or kernel | Slower, terminates TLS and parses HTTP |
| Can route by path (`/api` vs `/static`) | No | Yes |
| Examples | AWS NLB, IPVS, HAProxy in TCP mode | AWS ALB, nginx, HAProxy in HTTP mode, Envoy, Traefik |

**Algorithms**: round robin, weighted round robin, least connections (best for uneven request costs), IP hash (same client to same server), and consistent hashing (used by caches so a node failure remaps only its share).

**Health checks** poll each backend (`GET /healthz` expecting 200 within 2 s, 3 failures to eject). **Session persistence** ("sticky sessions") pins a user to one backend via a cookie when the application keeps state in memory; the better design stores session state in Redis so any backend can serve any user. Load balancers are themselves made redundant with an active-passive pair sharing a virtual IP (VRRP/keepalived) or with DNS returning several addresses.

```text
nginx as a layer 7 load balancer
upstream app {
    least_conn;
    server 10.0.5.11:8080 max_fails=3 fail_timeout=30s;
    server 10.0.5.12:8080 max_fails=3 fail_timeout=30s;
    server 10.0.5.13:8080 backup;
}
server {
    listen 443 ssl http2;
    location /api/  { proxy_pass http://app; proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; }
    location /static/ { root /var/www; expires 1y; add_header Cache-Control "public, immutable"; }
}
```

Because the backend sees the load balancer's IP, the client's real address arrives in `X-Forwarded-For` (or the PROXY protocol at layer 4), and applications must trust that header only from the load balancer.

### Caching at every layer

```text
Browser cache  ->  CDN edge  ->  reverse proxy cache (nginx/Varnish)  ->  application cache (Redis)  ->  database query cache
```

Each layer trades freshness for speed. The two hard problems are **invalidation** (when data changes, which copies are stale?) and **stampedes** (a popular key expires and a thousand requests hit the database at once; fix with request coalescing, locks or stale-while-revalidate).

> **Tip:** Rate matrices and policy documents that change weekly are perfect CDN candidates: version the file name on each release (`rates-tn-2026-09.json`), cache it for a year, and let the HTML that references it carry a 5-minute TTL. Nobody ever sees a stale rate and the origin serves it once per edge.

### Global traffic management

For multi-region deployments, **GeoDNS** or **latency-based routing** (Route 53, Cloudflare Load Balancing) sends users to the nearest healthy region, with health checks that fail over DNS answers within the TTL. Combine with anycast at the CDN for the fastest failover.

### Try It Yourself

```bash
# Observe CDN behaviour: cache status, edge location, protocol
curl -sI https://www.cloudflare.com/ | grep -iE 'cf-cache-status|cf-ray|server|alt-svc|cache-control'
# Fetch twice and compare cache status and timing
for i in 1 2; do curl -s -o /dev/null -w '%{http_code} %{time_starttransfer}s ' https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js; curl -sI https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js | grep -i cf-cache-status; done
# Which anycast edge answers you?  (Cloudflare exposes it)
curl -s https://www.cloudflare.com/cdn-cgi/trace | grep -E 'colo|http|ip'
```

### Quiz

1. How does anycast route a user to the nearest CDN edge?
- [ ] By returning a different IP per country from DNS
- [x] By announcing the same IP from many locations via BGP so routing picks the closest
- [ ] By HTTP redirects
> Anycast relies on internet routing; DNS-based steering is the other main technique.

2. Which header tells a CDN, but not the browser, how long to cache a response?
- [ ] `max-age`
- [x] `s-maxage`
- [ ] `ETag`
> `s-maxage` applies to shared caches only and overrides `max-age` for them.

3. A layer 4 load balancer cannot:
- [ ] Distribute TCP connections
- [x] Route `/api` and `/static` to different backend pools
- [ ] Health-check backends
> Path-based routing needs HTTP parsing, which is a layer 7 function.

4. What is a cache stampede?
- [x] Many simultaneous misses on the same expired key overwhelming the origin
- [ ] A CDN purge of all content
- [ ] A browser ignoring Cache-Control
> Mitigate with request coalescing, locking, early refresh or stale-while-revalidate.

### Exercises

1. **Set the headers** — Choose `Cache-Control` values for: a fingerprinted CSS file, the HTML of a dashboard, a per-user JSON API response, a weekly rate matrix PDF.
<details><summary>Solution</summary>

```text
app.3f9c2a.css        public, max-age=31536000, immutable
dashboard HTML        no-cache  (always revalidate with ETag; or max-age=60 if slight staleness is fine)
per-user JSON         private, no-store  (must never land in a shared cache)
rates-wy-2026-09.pdf  public, max-age=604800, s-maxage=2592000  (versioned name lets the CDN hold it a month)
```

</details>

2. **Design** — Sketch the request path for a document portal with users in the US and Pakistan, two application servers in Virginia, and a database. Name each component and its layer.
<details><summary>Solution</summary>

```text
User -> DNS (latency-based) -> CDN edge (anycast, TLS termination, static cache, WAF)
     -> origin: layer 7 load balancer (ALB/nginx, least_conn, health checks, X-Forwarded-For)
     -> app server 1 / app server 2 (stateless; sessions in Redis)
     -> Redis cache -> PostgreSQL (primary + read replica)
Pakistani users hit the Karachi/Lahore edge for static assets; dynamic API calls still
cross to Virginia, so keep API responses small and reuse connections.
```

</details>

### Interview Questions

**Q: How does a CDN decide what to cache, and how do you make dynamic content cacheable?**
By default a CDN caches responses whose URL and headers indicate they are static and shareable: a 200 with `Cache-Control: public` and a positive max-age, no `Set-Cookie`, and a cacheable method, keyed by URL plus `Vary` headers. Dynamic content becomes cacheable by separating what varies from what does not: render the shell HTML and the rate matrix as public resources with short TTLs and ETags, load per-user data through a small API marked `private, no-store`, and use cache tags so a rate update purges exactly the affected URLs. Edge compute can personalise on top of a cached base, and `stale-while-revalidate` keeps the edge serving during origin slowness. The measure of success is the hit ratio and origin request rate, which I would put on the dashboard next to TTFB by region.

**Q: Layer 4 versus layer 7 load balancing: when do you need each?**
Layer 4 balances TCP or UDP flows by 5-tuple without looking inside, so it is extremely fast, preserves end-to-end TLS, and handles non-HTTP protocols such as database connections, SMTP or game traffic; it cannot route by URL or inject headers. Layer 7 terminates TLS, parses HTTP, and can route by host and path, rewrite headers, do sticky sessions by cookie, apply WAF rules and support WebSocket upgrades and HTTP/2 to the client, at the cost of CPU and a TLS trust boundary at the balancer. In practice most web stacks use both: a layer 4 tier (NLB, IPVS) for raw scale and DDoS resilience in front of a layer 7 tier (ALB, nginx, Envoy) for routing, and a database or SFTP service behind a pure layer 4 balancer.

**Q: What happens when a backend behind a load balancer starts returning errors slowly rather than failing outright?**
This is the dangerous case: health checks that only test a TCP connect or a trivial `/healthz` keep the node in rotation while real requests time out, so a fraction of users suffer and retries amplify load. Good practice is deep health checks that exercise a dependency or return degraded status, tight timeouts on the balancer with limited retries to a different backend, outlier detection that ejects a node whose error rate or latency exceeds the others (Envoy does this natively), and circuit breakers in the clients. I would also alert on per-backend p99 latency and 5xx rate, not just on "up", and I would ensure the application fails fast when its database is unreachable rather than hanging, because a fast failure is something a load balancer can route around.

## Network security: attacks, IDS, VPNs and zero trust

Every earlier chapter had a protocol; this one has adversaries. Interviewers want to know that you can name the common attacks, explain the mechanism in one sentence, and give the control that stops it.

### Attacks by layer

| Layer | Attack | Mechanism | Control |
|---|---|---|---|
| 2 | ARP spoofing | Attacker answers ARP for the gateway, becomes man-in-the-middle | Dynamic ARP Inspection, static ARP on critical hosts, encrypted protocols |
| 2 | MAC flooding | Fill the switch table so it floods all traffic | Port security (max MACs per port) |
| 2 | Rogue DHCP | Attacker hands out itself as gateway/DNS | DHCP snooping on switches |
| 3 | IP spoofing | Forged source addresses, used in reflection DDoS | BCP 38 egress filtering at ISPs, uRPF |
| 4 | SYN flood | Half-open connections exhaust the server | SYN cookies, rate limits, scrubbing |
| 4 | Port scanning | Reconnaissance (`nmap -sS`) | Default-deny firewall, IDS alerting |
| 7 | DNS cache poisoning | Forged responses inserted into a resolver | DNSSEC, randomised source ports and IDs |
| 7 | DDoS amplification | Small spoofed requests to DNS/NTP/memcached produce huge replies | Close open resolvers, rate limit, CDN/scrubbing |
| 7 | Phishing and credential theft | Social engineering | MFA, phishing-resistant FIDO2 keys, awareness |
| 7 | SQL injection, XSS | Untrusted input reaches interpreter or browser | Parameterised queries, output encoding, WAF |
| Any | Man-in-the-middle | Intercept traffic on a shared medium or via rogue CA | TLS with validation, HSTS, certificate pinning, 802.1X |

### Detection: IDS and IPS

An **IDS** (Intrusion Detection System) watches traffic and raises alerts; an **IPS** sits inline and blocks. **Signature-based** engines (Snort, Suricata) match known patterns, such as a specific exploit payload; **anomaly-based** engines baseline normal behaviour and flag deviations, such as a scanner PC suddenly uploading 4 GB at 3 a.m. **Zeek** produces rich logs of every connection for hunting. All feed a **SIEM** (Splunk, Elastic, Microsoft Sentinel) where alerts are correlated with authentication and endpoint logs.

```text
Suricata rule (signature-based):
alert tcp any any -> $HOME_NET 3389 (msg:"RDP brute force"; flow:to_server; threshold:type both, track by_src, count 20, seconds 60; sid:1000001; rev:1;)
```

Encryption limits inspection: with TLS 1.3 an IDS sees SNI (until ECH) and traffic volumes but not content, so detection shifts to endpoints (**EDR**) and to metadata such as DNS queries, JA3/JA4 TLS fingerprints and beaconing patterns.

### VPNs

A **VPN** creates an encrypted tunnel so remote traffic behaves as if it were on the private network.

| Type | Protocol | Notes |
|---|---|---|
| Site-to-site | IPsec (IKEv2, ESP) | Office-to-office or office-to-cloud; always on; routers terminate it |
| Remote access | IPsec/IKEv2, SSL VPN (OpenVPN, TLS on 443), **WireGuard** | User laptops; WireGuard is ~4,000 lines of code, modern crypto, fast |
| Cloud | AWS Site-to-Site VPN, Azure VPN Gateway | IPsec to a managed endpoint; Direct Connect / ExpressRoute for private circuits |

**Full tunnel** sends all traffic through the office (better control, more bandwidth cost); **split tunnel** sends only private-network destinations through it. Split DNS ensures internal names resolve via the VPN. Weaknesses to know: the VPN concentrator is a single, juicy target (patch it first), a compromised laptop on a full-tunnel VPN is inside the network, and MTU issues (the Beginner chapter) plague tunnels.

```text
WireGuard peer config (client side)
[Interface]
PrivateKey = <client private key>
Address = 10.8.0.5/24
DNS = 10.0.0.53
[Peer]
PublicKey = <server public key>
Endpoint = vpn.example.com:51820
AllowedIPs = 10.0.0.0/8          # split tunnel: only private ranges go through
PersistentKeepalive = 25          # keep the NAT mapping alive
```

### Zero trust

The perimeter model assumed "inside = trusted". Laptops that roam, cloud services and phishing broke that. **Zero trust** (NIST SP 800-207) assumes no implicit trust from location: every request is authenticated, authorised and encrypted, based on identity, device health and context, with least-privilege access to specific applications rather than the whole network.

Concretely: single sign-on with MFA, device certificates and posture checks (disk encryption on, EDR running), an **identity-aware proxy** or ZTNA broker (Cloudflare Access, Zscaler Private Access, Tailscale) in front of each internal app instead of a network-wide VPN, **micro-segmentation** so servers only talk to what they must, and continuous logging. The VPN does not disappear overnight, but its scope shrinks to legacy protocols.

### Defence in depth for a document-production office

```text
Edge:      stateful firewall, default deny inbound, geo-blocking where legitimate, IPS
Segments:  agents / servers / printers / guests in separate VLANs with rules between them
Identity:  SSO + MFA everywhere; FIDO2 keys for admins; no shared accounts
Endpoints: EDR, disk encryption, patching within 14 days, USB control for client data
Data:      SFTP only, DLP on email, client documents never on personal devices
Monitoring: SIEM with firewall, DNS, auth and EDR logs; alert on impossible travel, mass download
People:    phishing simulations, clear reporting path, wire-fraud call-back procedure
Recovery:  offline backups tested by restore, incident runbook, cyber-insurance requirements met
```

> **Warning:** The three findings that appear in nearly every small-office assessment: RDP exposed to the internet, a shared admin password, and backups on the same network as the servers. Fix those before buying any product.

### Try It Yourself

```bash
# Safe reconnaissance of your own host and a first-pass hardening check (only on systems you own)
sudo ss -tulpn                                       # what is listening; every line needs a reason
nmap -sS -p- --open 127.0.0.1                        # same, from the network view
sudo nmap -sV -p 22,80,443,3389 <your-own-server>    # service versions to check against advisories
# Detect ARP spoofing on your LAN: a gateway MAC that changes is the signal
ip neigh | grep "$(ip route | awk '/default/ {print $3; exit}')"
# Quick WireGuard key pair to see how small the setup is
wg genkey | tee private.key | wg pubkey > public.key; cat public.key
```

### Quiz

1. What does DHCP snooping protect against?
- [ ] SYN floods
- [x] Rogue DHCP servers handing out a malicious gateway or DNS
- [ ] Expired certificates
> Switches with DHCP snooping only allow DHCP offers from trusted ports.

2. What is the difference between an IDS and an IPS?
- [ ] An IDS is signature-based and an IPS is anomaly-based
- [x] An IDS alerts; an IPS sits inline and can block
- [ ] An IPS only works on wireless
> Same detection engines; the difference is whether the device is in the traffic path with the power to drop.

3. In a split-tunnel VPN, which traffic goes through the tunnel?
- [ ] All traffic
- [x] Only traffic to the private network's address ranges
- [ ] Only DNS
> `AllowedIPs = 10.0.0.0/8` style routes send private destinations through the VPN and the rest directly.

4. Zero trust primarily replaces trust in what?
- [x] Network location as a proxy for identity
- [ ] Encryption
- [ ] Multi-factor authentication
> Zero trust verifies identity, device and context on every request instead of trusting "inside the LAN".

### Exercises

1. **Map attack to control** — For each: an agent's PC gets a rogue gateway; a server is flooded with half-open connections; a resolver returns a forged IP for the bank. Name the attack and the control.
<details><summary>Solution</summary>

```text
Rogue gateway     -> rogue DHCP or ARP spoofing -> DHCP snooping + Dynamic ARP Inspection
Half-open flood   -> SYN flood -> SYN cookies, connection rate limiting, upstream scrubbing
Forged bank IP    -> DNS cache poisoning -> DNSSEC validation, source-port randomisation, DoH to a trusted resolver
```

</details>

2. **Plan the migration** — A 40-person office uses a full-tunnel SSL VPN to reach three internal web apps and one SFTP server. Propose a zero-trust design and say what stays on VPN.
<details><summary>Solution</summary>

```text
Put the three web apps behind an identity-aware proxy (Cloudflare Access / ZTNA) with SSO,
MFA and device-posture checks; publish them by hostname, no inbound firewall holes.
SFTP stays reachable through the ZTNA client's TCP tunnelling or through a WireGuard split
tunnel limited to that server's /32, key-based auth, source logged.
Retire the full-tunnel VPN after 90 days of parallel running; keep an emergency profile.
```

</details>

### Interview Questions

**Q: Explain how an ARP spoofing attack works and how you would detect and prevent it.**
On a LAN, hosts map the gateway's IP to a MAC via ARP, which has no authentication; an attacker broadcasts gratuitous ARP replies claiming the gateway's IP belongs to their MAC, so victims send all outbound traffic through the attacker, who forwards it onward and reads or modifies it, including downgrading or stripping insecure sessions. Detection: the gateway's MAC in `ip neigh` or `arp -a` changing, tools like arpwatch, and switch logs from Dynamic ARP Inspection. Prevention: DAI and DHCP snooping on managed switches so the switch drops ARP replies that do not match the DHCP lease table, port security, 802.1X so only authenticated devices join, and, as the real safety net, end-to-end TLS with HSTS so an interceptor sees only ciphertext. On guest and open Wi-Fi, client isolation removes the shared segment entirely.

**Q: Compare IPsec, OpenVPN and WireGuard for remote access.**
IPsec with IKEv2 is the standard built into every OS and router, works well for site-to-site and is fast in kernel space, but its configuration surface is large, NAT traversal needs UDP 4500, and interoperability between vendors still costs hours. OpenVPN runs in user space over TLS on any port, typically 443, so it passes restrictive networks, but it is slower per core and its codebase is large. WireGuard is about 4,000 lines in the Linux kernel with fixed modern cryptography, static public keys per peer, roaming that survives IP changes, and the highest throughput of the three; its limitations are no built-in user authentication or dynamic address assignment, which products like Tailscale add on top. For a new remote-access deployment I would choose WireGuard behind an identity layer, keep IKEv2 for site-to-site with cloud providers, and use OpenVPN only where a TCP 443 fallback is essential.

**Q: What does zero trust mean in practice, and what is the first step for a small company?**
In practice it means access decisions are made per request based on who the user is, what device they are on and how healthy it is, and what specific application they want, rather than on whether they are plugged into the office LAN or connected to the VPN. The first step is identity: consolidate logins behind one identity provider with SSO and MFA, because every later control keys off it. Next put the internal web applications behind an identity-aware proxy so they are reachable without a network-level VPN, then add device posture checks and segment the servers so lateral movement is blocked. Along the way the SIEM should log every access decision. I would be honest that legacy protocols like SMB and RDP still need a tunnel, so the goal is shrinking the trusted network, not deleting it on day one.

## Cloud networking basics: VPCs, subnets and security groups

Cloud networking is the same networking with the cables replaced by APIs. Once you can map VPC, subnet, route table, gateway and security group onto the concepts from earlier chapters, AWS, Azure and Google Cloud all make sense.

### The building blocks

| Concept | AWS | Azure | Google Cloud | Traditional equivalent |
|---|---|---|---|---|
| Private network | VPC | Virtual Network (VNet) | VPC (global) | Your office LAN plus its router |
| Address block | CIDR e.g. `10.0.0.0/16` | Address space | Subnet ranges per region | Your RFC 1918 allocation |
| Subnet | Subnet in one AZ | Subnet | Subnet in one region | VLAN |
| Route table | Route table per subnet | Route table (UDR) | Routes | The router's table |
| Internet access | Internet Gateway | Default outbound / NAT Gateway | Cloud NAT / external IP | Edge router with NAT |
| Outbound-only for private hosts | NAT Gateway | NAT Gateway | Cloud NAT | NAT with no inbound forwards |
| Per-instance firewall | Security Group (stateful) | Network Security Group | VPC firewall rules | Host firewall |
| Per-subnet ACL | Network ACL (stateless) | NSG on subnet | — | Router ACL |
| Private link to on-prem | Site-to-Site VPN / Direct Connect | VPN Gateway / ExpressRoute | Cloud VPN / Interconnect | Site-to-site IPsec / leased line |
| Network-to-network | VPC Peering / Transit Gateway | VNet Peering / Virtual WAN | VPC Peering / NCC | Router between two LANs |
| Private access to cloud services | VPC Endpoints (PrivateLink) | Private Endpoints | Private Google Access | — |

### A standard two-tier layout

```text
VPC 10.0.0.0/16, region us-east-1

Public subnet A   10.0.1.0/24 (AZ a)   route: 0.0.0.0/0 -> Internet Gateway   [load balancer, bastion, NAT GW]
Public subnet B   10.0.2.0/24 (AZ b)   route: 0.0.0.0/0 -> Internet Gateway
Private subnet A  10.0.11.0/24 (AZ a)  route: 0.0.0.0/0 -> NAT Gateway        [app servers]
Private subnet B  10.0.12.0/24 (AZ b)  route: 0.0.0.0/0 -> NAT Gateway
Data subnet A/B   10.0.21.0/24, 10.0.22.0/24   no default route              [database]
```

"Public" simply means the subnet's route table points at the Internet Gateway and instances have public IPs. Private instances reach the internet for updates through the NAT Gateway but cannot be reached from it. The database subnets have no internet route at all. Two Availability Zones give resilience to a data-centre failure; every tier appears in both.

### Security groups versus network ACLs (AWS)

**Security groups** attach to instances (strictly to network interfaces). They are **stateful** and **allow-only**: you list what may come in and go out; return traffic is automatic. Rules can reference other security groups, which is the feature that makes cloud firewalls cleaner than IP lists.

```text
sg-web   inbound: TCP 443 from 0.0.0.0/0 ; TCP 80 from 0.0.0.0/0
sg-app   inbound: TCP 8080 from sg-web            (only the load balancer tier can reach the app)
sg-db    inbound: TCP 5432 from sg-app            (only app servers can reach PostgreSQL)
sg-bastion inbound: TCP 22 from 203.0.113.0/24    (office IP range only)
```

**Network ACLs** attach to subnets, are **stateless**, have numbered allow and deny rules evaluated in order, and need explicit rules for ephemeral return ports. Use them sparingly as a coarse backstop (block a known-bad range) and put the real policy in security groups.

```bash
# AWS CLI: create a security group and allow HTTPS from anywhere, app port only from another group
aws ec2 create-security-group --group-name sg-web --description "web tier" --vpc-id vpc-0abc
aws ec2 authorize-security-group-ingress --group-id sg-0web --protocol tcp --port 443 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id sg-0app --protocol tcp --port 8080 --source-group sg-0web
# Reachability check without logging in to anything
aws ec2 describe-security-groups --group-ids sg-0app --query 'SecurityGroups[0].IpPermissions'
```

### Reserved addresses and DNS in the cloud

AWS reserves five addresses per subnet (network, VPC router at .1, DNS at .2, one for future use, broadcast); the VPC's resolver at `10.0.0.2` (the base + 2) answers private hosted zones and forwards the rest. Azure reserves five as well and uses `168.63.129.16` for its platform DNS. Private DNS zones let `db.internal.example.com` resolve only inside the VPC.

### Connecting to the cloud

A **site-to-site VPN** over the internet is the quick option (IPsec, ~1.25 Gbps per tunnel on AWS, minutes to set up). **Direct Connect** or **ExpressRoute** is a private circuit through a colocation partner with predictable latency and no internet exposure, weeks to provision, and used by anyone moving terabytes or running latency-sensitive workloads. **Transit Gateway** (AWS) or **Virtual WAN** (Azure) is a hub that connects many VPCs and on-prem links so you do not build a mesh of peerings. **VPC endpoints** keep traffic to S3, DynamoDB or a partner's service on the provider's network, which avoids NAT Gateway data charges and internet exposure.

### Cost and observability

NAT Gateway charges per GB processed and per hour, so a private subnet pulling large datasets from S3 through it is an expensive mistake that a gateway endpoint fixes for free. Cross-AZ and cross-region traffic is billed; same-AZ is not. **VPC Flow Logs** record accepted and rejected flows per interface (source, destination, port, bytes, action) and are the cloud equivalent of a firewall log; query them in CloudWatch Logs Insights or Athena when a security group "should" allow something and does not.

```text
VPC Flow Log record (AWS default format)
2 123456789012 eni-0a1b 10.0.11.5 10.0.21.7 43210 5432 6 12 3400 1694860000 1694860060 ACCEPT OK
version account interface  src        dst       srcport dstport proto packets bytes start end action status
```

> **Tip:** The reachability analyser tools (AWS VPC Reachability Analyzer, Azure Network Watcher IP flow verify) tell you which route table, NACL or security group is blocking a path without a single packet capture. Use them before opening a ticket.

### Try It Yourself

```bash
# Read a VPC's topology with the AWS CLI (read-only; needs credentials)
aws ec2 describe-vpcs --query 'Vpcs[].{id:VpcId,cidr:CidrBlock}' --output table
aws ec2 describe-subnets --query 'Subnets[].{id:SubnetId,cidr:CidrBlock,az:AvailabilityZone,public:MapPublicIpOnLaunch}' --output table
aws ec2 describe-route-tables --query 'RouteTables[].Routes[].{dst:DestinationCidrBlock,target:GatewayId||NatGatewayId}' --output table
# Ask the platform why a path is blocked
aws ec2 create-network-insights-path --source i-0abc --destination i-0def --destination-port 5432 --protocol tcp
```

### Quiz

1. What makes a subnet "public" in AWS?
- [ ] Its CIDR starts with a public range
- [x] Its route table sends `0.0.0.0/0` to an Internet Gateway
- [ ] It has a NAT Gateway
> Subnets are private or public purely by routing; the CIDR is always from the VPC's private block.

2. Security group rule: inbound TCP 8080 from `sg-web`. What does it allow?
- [ ] Any host on port 8080
- [x] Only traffic from instances that have sg-web attached
- [ ] Traffic from the web subnet's CIDR
> Referencing a group by ID follows the instances wherever their IPs change.

3. Why do network ACLs need a rule allowing ephemeral ports 1024–65535 outbound?
- [x] They are stateless, so return traffic must be explicitly allowed
- [ ] Security groups require it
- [ ] The NAT Gateway uses them
> A stateful security group tracks connections; a NACL evaluates each packet alone.

4. How does an app server in a private subnet download OS updates?
- [ ] Through the Internet Gateway with a public IP
- [x] Through a NAT Gateway in a public subnet
- [ ] It cannot
> The NAT Gateway translates outbound connections; nothing inbound can be initiated.

### Exercises

1. **Design the VPC** — Lay out a VPC for a document-processing API with a load balancer, two app servers, a PostgreSQL database and a bastion, in two AZs. Give CIDRs, subnets, route targets and security groups.
<details><summary>Solution</summary>

```text
VPC 10.20.0.0/16
public-a  10.20.0.0/24  public-b 10.20.1.0/24    0.0.0.0/0 -> igw      ALB, bastion, NAT GW
app-a     10.20.10.0/24 app-b    10.20.11.0/24   0.0.0.0/0 -> nat-gw   app servers
db-a      10.20.20.0/24 db-b     10.20.21.0/24   no default route      RDS PostgreSQL (multi-AZ)
sg-alb:     in 443 from 0.0.0.0/0
sg-app:     in 8080 from sg-alb; in 22 from sg-bastion
sg-db:      in 5432 from sg-app
sg-bastion: in 22 from office /24 only
S3 gateway endpoint on app route tables so document uploads bypass the NAT Gateway.
```

</details>

2. **Debug** — An app server cannot reach RDS on 5432. Security groups look right. List three more things to check, in order.
<details><summary>Solution</summary>

```text
1. Are both in the same VPC or peered, and does the app subnet's route table have a route to the DB subnet (local route covers same VPC)?
2. Network ACL on the db subnet: inbound 5432 from the app CIDR and outbound ephemeral 1024-65535 back.
3. Is the RDS security group referencing the right app SG (not an old one), and is RDS listening on 5432 (custom port?). Then run Reachability Analyzer and read VPC Flow Logs for REJECT lines.
```

</details>

### Interview Questions

**Q: Compare security groups and network ACLs and explain how you would use both.**
Security groups are stateful, instance-level, allow-only firewalls that can reference other groups, so "app accepts 8080 only from the load balancer's group" is one rule that survives scaling and IP changes; they are the primary control and I model tiers with them. Network ACLs are stateless, subnet-level, ordered allow-and-deny lists that require explicit ephemeral-port rules for return traffic; they are coarse, easy to get wrong, and rarely worth complex policy. I use NACLs as a backstop: deny known-bad ranges, block all inbound to data subnets except from app subnets, and otherwise leave them permissive so the real policy lives in security groups. In an incident, a NACL deny is also the fastest way to isolate a whole subnet without touching dozens of instances.

**Q: A team wants the app servers to have public IPs "so they can reach the internet". What do you tell them?**
Reaching the internet does not require being reachable from it. A public IP on an app server exposes every open port to scanners the moment a security group rule is loosened, and it makes the server's identity to external services an individual address rather than a controlled egress point. The right pattern is private subnets with a NAT Gateway for outbound, gateway endpoints for S3 and DynamoDB to avoid NAT charges and keep traffic private, interface endpoints for other AWS services, and a load balancer in the public subnet as the only inbound entry. If they need a fixed egress IP for a partner's allowlist, the NAT Gateway's Elastic IP provides exactly that, which is a stronger argument than the public-IP approach they proposed.

**Q: How would you connect an on-premises office to a VPC, and how would you choose between VPN and a dedicated circuit?**
A site-to-site IPsec VPN from the office firewall to the cloud VPN gateway with two tunnels for redundancy and BGP for route exchange can be up in an afternoon and costs little, but its throughput is limited to roughly a gigabit per tunnel, latency and jitter follow the public internet, and the data still traverses ISP paths. Direct Connect or ExpressRoute provides a private circuit through a colocation partner with consistent latency, higher bandwidth, and lower per-GB egress pricing, at the cost of weeks of provisioning and a monthly port fee. I would start with the VPN, measure the actual traffic and latency requirements, and move to a dedicated circuit when sustained transfer exceeds a few hundred megabits or when applications are latency-sensitive, keeping the VPN as the failover path, which cloud providers support natively.

## Networks interview and viva questions

This chapter is the rehearsal room. The questions below are the ones that appear in university vivas, infrastructure and DevOps interviews, and the "just checking you know the basics" round for developers and analysts. Each answer is what a strong candidate says in under a minute, with the follow-ups an interviewer is likely to add.

### The one question you must own

"What happens when you type `https://www.example.com` and press Enter?" Rehearse this structure and expand any step on demand.

```text
1. URL parsing; browser checks HSTS list and its own caches (DNS, connection, HTTP cache).
2. DNS: OS cache, hosts file, recursive resolver -> root -> .com -> authoritative -> A/AAAA (parallel).
3. TCP: SYN, SYN-ACK, ACK to port 443 (or QUIC on UDP 443 if Alt-Svc/HTTPS record says so).
4. TLS 1.3: ClientHello with SNI and key share, ServerHello, certificate chain validated against
   trust store, hostname matches SAN, keys derived, 1 RTT.
5. HTTP: GET / with Host, cookies, Accept headers; HTTP/2 multiplexes further requests.
6. Server: load balancer -> app -> cache/database -> response with status, headers, body.
7. Browser: parse HTML, fetch CSS/JS/images (many over the same connection), render, run scripts.
8. Underneath every step: ARP for the gateway MAC, NAT at the edge, routers doing longest-prefix
   match hop by hop, TTL decrementing, congestion control pacing the segments.
```

### Rapid-fire fundamentals

| Question | Answer in one breath |
|---|---|
| Hub vs switch vs router | Hub repeats bits to all ports (layer 1); switch forwards frames by MAC (layer 2); router forwards packets by IP between networks (layer 3) |
| MAC vs IP | MAC is a fixed hardware identifier used on one link; IP is a logical, routable address that can change with location |
| TCP vs UDP | TCP: connection, ordered, reliable, flow and congestion control; UDP: connectionless, minimal, for real-time and query/response |
| What is a port | A 16-bit number that identifies the application endpoint within a host; the 4-tuple identifies a connection |
| What is a subnet mask | The bits that mark the network portion; determines whether a destination is local or via the gateway |
| Default gateway | The router used for any destination outside the local subnet |
| DNS record types | A, AAAA, CNAME, MX, NS, TXT, PTR, SOA, SRV |
| 301 vs 302 | Permanent (cached, SEO weight transfers) vs temporary |
| 401 vs 403 | Unauthenticated vs authenticated but forbidden |
| HTTP vs HTTPS | Same protocol; HTTPS inside TLS on 443 gives confidentiality, integrity, authentication |
| Symmetric vs asymmetric encryption | One shared key, fast, bulk data; key pair, slow, used for key exchange and signatures |
| What is NAT | Rewriting private addresses to a shared public one with a port mapping table |
| Stateful vs stateless firewall | Tracks connections and admits replies automatically vs judges each packet alone |
| Latency vs bandwidth | Delay per bit vs bits per second; RTT dominates small requests, bandwidth dominates bulk |
| What is ARP | Resolves an IP to a MAC on the local link by broadcast |
| What is ICMP | Control and error messages for IP: ping, unreachable, TTL exceeded, fragmentation needed |
| VPN | Encrypted tunnel that extends a private network over a public one |
| CDN | Distributed edge caches close to users with anycast or DNS steering |
| Load balancer | Distributes requests across backends with health checks, at layer 4 or 7 |
| Zero trust | No implicit trust by network location; verify identity, device and context per request |

### Scenario questions and how to structure the answer

**"Users in one office cannot reach the cloud app; other offices can."** Scope it (one office), then layers: their gateway and DNS, their edge firewall rules and any recent change, their NAT public IP against the app's allowlist or WAF geo-rules, and a traceroute from that office compared with a working one. Say what you would check, in what order, and what each result would prove.

**"Design the network for a new 50-person office."** Address plan (a /22 split into VLANs for staff, VoIP, printers, servers, guests, management), a layer 3 switch or firewall routing between them with default-deny rules, dual ISP with failover, Wi-Fi 6 with WPA3-Enterprise and a guest SSID, DHCP with reservations, internal DNS, a site-to-site VPN or ZTNA to the cloud, monitoring, and documentation. Draw it if there is a whiteboard.

**"Our API is slow only for users in Pakistan."** RTT physics (230 ms to the US), a CDN or regional deployment, connection reuse and HTTP/2, payload size, and measurement with `curl -w` from Lahore before and after.

### Viva questions from the university syllabus

```text
Q  Explain the difference between circuit and packet switching with an example of each.
Q  Draw the TCP header and explain sequence, acknowledgement, window and the flag bits.
Q  Why does TCP use a three-way handshake? What is a SYN flood?
Q  Explain sliding window flow control and how it differs from stop-and-wait.
Q  Compare distance-vector and link-state routing; give the count-to-infinity problem.
Q  How does CSMA/CD work and why is it no longer used on switched Ethernet?
Q  Explain the IPv4 header fields TTL, identification, flags and fragment offset.
Q  What is the hidden-terminal problem in wireless networks and how does RTS/CTS help?
Q  Describe DNS resolution from a stub resolver to an authoritative server.
Q  How does HTTPS establish a shared key without sending it? (Diffie-Hellman)
Q  What are the differences between IPv4 and IPv6 headers?
Q  Explain Nagle's algorithm and delayed ACKs, and when you would disable Nagle.
Q  What is the difference between a bridge, a switch and a router?
Q  How does traceroute work?
Q  Explain go-back-N and selective repeat ARQ.
```

Answer each with definition, mechanism, example, trade-off. Examiners award marks for the trade-off.

### Questions candidates get wrong

- **"Is ping a good test that a web server is up?"** No: ICMP proves routing, not that port 443 is listening or TLS works; use `nc -zv` and `curl -I`.
- **"Does NAT make a network secure?"** It hides inside addresses and blocks unsolicited inbound as a side effect, but it is not a firewall, does nothing for outbound threats, and IPv6 networks are equally safe with a default-deny firewall.
- **"Is UDP faster than TCP?"** UDP has less overhead and no handshake or retransmission delay, but on a clean network throughput is similar; UDP is chosen for latency tolerance and application-controlled reliability, not raw speed.
- **"Does a bigger pipe fix slow remote desktop?"** No; RDP is latency-bound.
- **"Is HTTPS traffic invisible to my employer?"** The content is encrypted, but the destination IP, SNI hostname (unless ECH), timing and volume are visible, and a corporate root CA enables full inspection.

> **Interview note:** For any "explain X" question, finish with one sentence on where X fails or what it costs. "TCP guarantees delivery, at the cost of latency under loss, which is why real-time media avoids it." That last clause is what turns a textbook answer into an engineer's answer.

### Try It Yourself

```bash
# A ten-minute self-test: run each and explain every line of output aloud, as if to an interviewer
ip addr && ip route                        # addresses, subnet, gateway
ip neigh                                   # ARP cache: MAC of the gateway
dig +trace www.example.com | tail -5       # DNS delegation to the authoritative answer
sudo tcpdump -i any -n -c 6 'tcp port 443' # SYN, SYN-ACK, ACK, then TLS ClientHello
curl -sv https://www.example.com/ -o /dev/null 2>&1 | grep -E 'SSL connection|subject:|issuer:|HTTP/'
ss -tan | awk '{print $1}' | sort | uniq -c   # socket states on this host
```

### Quiz

1. Which order of steps is correct for loading an HTTPS page on a fresh connection?
- [x] DNS, TCP handshake, TLS handshake, HTTP request
- [ ] TCP handshake, DNS, HTTP request, TLS handshake
- [ ] TLS handshake, DNS, TCP handshake, HTTP request
> You need an IP before connecting, a connection before TLS, and TLS before the encrypted request.

2. "Ping works but the website does not." Which layer is proven and which is suspect?
- [ ] Layer 2 proven, layer 3 suspect
- [x] Layer 3 proven, layer 4 or 7 suspect
- [ ] Nothing is proven
> ICMP reachability shows routing works; a blocked port, stopped service or TLS error remains possible.

3. Which statement about NAT is correct?
- [ ] NAT encrypts traffic
- [x] NAT blocks unsolicited inbound connections as a side effect but is not a firewall
- [ ] NAT is required for IPv6
> NAT's security is incidental; an explicit default-deny firewall is the real control.

4. What is the best one-line answer to "why is UDP used for DNS"?
- [x] A query and answer each fit in one packet, so a handshake would double the cost; retries are trivial
- [ ] UDP is encrypted
- [ ] TCP cannot carry DNS
> DNS does use TCP for large answers and zone transfers; UDP is the default for efficiency.

### Exercises

1. **Two-minute answer** — Write your own answer to "what happens when you type a URL" in eight numbered lines, then time yourself saying it.
<details><summary>Solution</summary>

```text
1 Browser parses URL, checks HSTS and caches.  2 DNS resolves the name via resolver, root, TLD, authoritative.
3 TCP three-way handshake to port 443 (or QUIC).  4 TLS 1.3 handshake: SNI, key share, certificate chain validated, keys derived.
5 HTTP GET with headers and cookies over HTTP/2.  6 Load balancer routes to an app server, which queries cache and database.
7 Response with status, headers, body; browser parses HTML and fetches assets over the same connection.
8 Throughout: ARP, NAT, hop-by-hop routing with TTL, congestion control; end with where each step can fail.
```

</details>

2. **Trade-off drill** — For TCP, NAT, CDN and VPN, write one sentence each on the cost or failure mode.
<details><summary>Solution</summary>

```text
TCP  reliable and ordered at the cost of latency under loss and head-of-line blocking.
NAT  conserves addresses and hides hosts, but breaks end-to-end connectivity and embedded-address protocols.
CDN  cuts RTT and origin load, but adds cache invalidation complexity and a third party in the TLS path.
VPN  extends the private network securely, but makes the concentrator a prime target and adds MTU and latency overhead.
```

</details>

3. **Scenario** — Structure a one-minute answer to "our API is slow only from Pakistan".
<details><summary>Solution</summary>

```text
Measure first: curl -w timing from Lahore shows connect ~230 ms and TLS ~230 ms per new
connection. Causes: physics, new connection per call, large payloads. Fixes in order:
connection reuse and HTTP/2, a CDN edge terminating TLS in Karachi, smaller responses,
and if still needed a regional deployment or read replica in Asia. Re-measure after each.
```

</details>

### Interview Questions

**Q: You have five minutes: explain the whole path of an HTTPS request to a non-technical manager, then to a network engineer.**
For the manager: the browser first looks up the site's address like a phone book (DNS), then opens a secure line by checking the site's identity card (the certificate) and agreeing a secret code, then asks for the page, and the answer travels back through a chain of post offices (routers) that each only know the next hop; slowness usually comes from distance, not from the size of the pipe. For the engineer: recursive resolution with cached delegations, TCP three-way handshake or QUIC, TLS 1.3 one-RTT handshake with ECDHE and chain validation against the trust store, HTTP/2 multiplexed request, layer 7 load balancer to the origin, response cached at the CDN by `Cache-Control`, and underneath it ARP for the gateway, NAT at the edge, BGP-learned routes with longest-prefix match, and CUBIC or BBR pacing the segments. Being able to switch registers is itself what the interviewer is testing.

**Q: What are the most common causes of "the network is slow" in an office, in your experience?**
In order of frequency: Wi-Fi problems (co-channel interference, 2.4 GHz congestion, one distant client dragging airtime), DNS latency or a failing primary resolver making every page wait for a timeout before the secondary answers, bufferbloat on the internet router during backups or large uploads, a saturated uplink because someone is syncing a cloud drive, and latency to a far-away server that no amount of bandwidth fixes. Less common but dramatic: duplex mismatch or a bad cable causing CRC errors, an MTU problem on a VPN making large transfers hang, and a switch loop when someone plugs both ends of a cable into the wall. My approach is always to measure with `curl -w`, `mtr` and the AP's client table before changing anything, because the fix for each of these is different and guessing wastes a day.

**Q: What would you study next after this course, and why?**
For infrastructure roles, the CCNA syllabus for hands-on switching, routing and subnetting drills, then Linux networking (netfilter, namespaces, which underpin Docker and Kubernetes networking). For cloud and DevOps roles, the AWS or Azure networking specialty material and Kubernetes networking (CNI, Services, Ingress, network policies), because that is where the OSI layers reappear in disguise. For security roles, packet analysis with Wireshark and Zeek, then the Security+ or a hands-on lab platform. I would also read the RFCs for TCP (9293), HTTP semantics (9110) and QUIC (9000) selectively, because interviewers at senior levels ask questions whose answers are in the primary sources rather than in tutorials.

