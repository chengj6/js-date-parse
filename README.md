# js-date-parse
A lightweight library meant to parse strings from any arbitrary format into Date objects

[![Build Status](https://travis-ci.org/fernap3/js-date-parse.svg?branch=master)](https://travis-ci.org/fernap3/js-date-parse)

## Format Specifiers
The following format specifiers are supported: 

`yyyy` Four-digit year eg. `2004`  
`yy` Two-digit year eg. `04`  
`M` One or two-digit month eg. `4`  
`MM` Two-digit month eg. `04`  
`MMM` Short month name, one of `jan,feb,mar,apr,may,jun,jul,aug,sept,oct,nov,dec`  
`MMMM` Long month name, one of `january,february,march,april,may,june,july,august,september,october,november,december`  
`d` One or two-digit day eg. `4`  
`dd` Two-digit day eg. `04` 
`ddd` Short day name, one of `su,mo,tu,we,th,fr,sa`  
`dddd` Long day name, one of `sunday,monday,tuesday,wednesday,thursday,friday,saturday`  
`h` One or two-digit hour eg. `4`  
`hh` Two-digit hour eg. `04` 
`m` One or two-digit minute eg. `4`  
`mm` Two-digit minute eg. `04` 
`s` One or two-digit second eg. `4`  
`ss` Two-digit second eg. `04` 
`f` Tenths of a second  
`ff` Hundreths of a second  
`fff` Thousands of a second eg. `4`  
`t` First letter of am or pm eg. `p`  
`tt` am or pm eg. `pm`  
`'text'` Literal text eg. `'peter'`
