# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

# Development

 1. git clone git@github.com:iamrahulrnair/weather-app.git
 2. pnpm install && cd server && pnpm install && cd ..
 3. docker-compose up
 4. pnpm start

 Sample test data:

|  location| lat  |	lng|
|--|--|--|
| California | 36.778259  |-119.417931	 |
| London | 51.5073509  |-0.1277583 |
| New delhi |28.613939  |77.209023	 |
 

## Configuration

App configuration can be edited in src/config.json. can configure -

 - [ ]  No: days to forcast
 - [ ] minimum and maximum threshold temperatures

##  Stack

 - [ ] Nextjs (tRPC migrated to Expressjs) 
 - [ ] Prisma Migrated to mongoose