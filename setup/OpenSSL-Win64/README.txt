This product includes software developed by the OpenSSL Project for use in the 
OpenSSL Toolkit. (http://www.openssl.org/)"

This is a binary distribution of OpenSSL for 64bit Editions of Windows for the 
AMD64 instruction set. The binaries were compiled with the "Microsoft Platform 
SDK for Windows Server 2003 R2" and using only the instructions located in the 
official OpenSSL toolkit source-code distribution's INSTALL.W64 file.

These are not official binaries from The OpenSSL Project. The OpenSSL Project 
consider Win64 Operating support to be initial. The software is licensed by the 
The OpenSSL Project in their LICENSE file included in this distribution.

The binaries are only being made available in this distribution for the benefit 
of Win64 developers.

Please read the original OpenSSL Project's readme file in README.orig.txt.

REDISTRIBUTION TO END-USERS

You need to include the libeay32.dll and ssleay32.dll in your installation. We 
also recommend that you include openssl.exe because that program includes 
certificate utility functions that some users will require.

These files have the same filename as the 32-bit versions so you must use 
extreme care when installing these files. They should NEVER be installed on a 
32-bit Editions of Windows. On 64-bit Editions of Windows, you should place 
these files in the same directory as your software instead of a shared 
location. This should prevent problems with 32-bit programs that require 
OpenSSL.

If you need OpenSSL binaries for 32-bit Editions of Windows, you should visit 
http://www.openssl.org/related/binaries.html.
