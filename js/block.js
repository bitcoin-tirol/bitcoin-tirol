/**
 * @author Roland Schellhorn / pixelparker / SatoshistoreIO
 * @version 1.0
 */

const halvingBlock = 840000 // 84000
const updateInterval = 21000;
const defaultTimeBetweenBlocks = 10;
let lastBlock = false;
let countdownInterval;

function fetchData() {
  fetch('https://api.blockchain.info/stats')
    .then(response => response.json())
    .then(data => {
      const currentBlock = data.n_blocks_total;
      const blocksToHalving = halvingBlock - currentBlock;
      const timeBetweenBlocks = data.minutes_between_blocks;

      if (currentBlock >= halvingBlock) {
        document.getElementById('blockinfo').style.display = 'none';
        document.getElementById('blockinfo-final').style.display = 'block';
        if (countdownInterval) {
          clearInterval(countdownInterval);
        }
        return;
      }

      if (currentBlock === halvingBlock-1) {
        lastBlock = true;
      }

      const minutesBetweenBlocks = data.minutes_between_blocks;
      const timeToHalvingMinutes = blocksToHalving * minutesBetweenBlocks;
      const defaultTimeToHalvingMinutes = blocksToHalving * defaultTimeBetweenBlocks;

      displayHalvingDateInTimezones(timeToHalvingMinutes * 60);
      displayDefaultHalvingDateInTimezones(defaultTimeToHalvingMinutes * 60);

      const marketPrice = data.market_price_usd.toLocaleString('de-DE', {style: 'currency', currency: 'USD'});

      const days = Math.floor(timeToHalvingMinutes / (60 * 24));
      const hours = Math.floor((timeToHalvingMinutes % (60 * 24)) / 60);
      const minutes = Math.floor(timeToHalvingMinutes % 60);

      const defaultDays = Math.floor(defaultTimeToHalvingMinutes / (60 * 24));
      const defaultHours = Math.floor((defaultTimeToHalvingMinutes % (60 * 24)) / 60);
      const defaultMinutes = Math.floor(defaultTimeToHalvingMinutes % 60);

      document.getElementById('currentBlock').textContent = currentBlock;
      document.getElementById('blocksToHalving').textContent = blocksToHalving;
      document.getElementById('timeBetweenBlocks').textContent = `${timeBetweenBlocks} Minuten`;
      document.getElementById('marketPrice').textContent = marketPrice;
      document.getElementById('timeToHalving').textContent = `${days} Tage, ${hours} Stunden, ${minutes} Minuten`;
      document.getElementById('defaultTimeToHalving').textContent = `${defaultDays} Tage, ${defaultHours} Stunden, ${defaultMinutes} Minuten`;

      //updateCountdown(timeToHalvingMinutes * 60);
      updateCountdown(defaultTimeToHalvingMinutes * 60);
      updateApiCallCountdown();
    })
    .catch(error => {
      console.error('error fetching blockchain data:', error);
    });
}

function updateApiCallCountdown() {
  let countdown = updateInterval / 1000;
  const countdownElement = document.getElementById('updateIn');
  const intervalId = setInterval(() => {
    countdown--;
    countdownElement.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(intervalId);
      countdownElement.textContent = updateInterval / 1000;
    }
  }, 1000);
}

function updateCountdown(seconds) {
  if (lastBlock) {
    document.getElementById('countdown').textContent = "< 10 Minuten bis zum Halving!";
    return;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  const countdownElement = document.getElementById('countdown');
  let remainingTime = seconds;

  countdownInterval = setInterval(() => {
    const days = Math.floor(remainingTime / (60 * 60 * 24));
    const hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
    const seconds = Math.floor(remainingTime % 60);

    //countdownElement.textContent = `${days} Tage, ${hours} Stunden, ${minutes} Minuten, ${seconds} Sekunden`;
    countdownElement.textContent = `${days} Tage, ${hours} Stunden, ${minutes} Minuten`;
    remainingTime--;

    if (remainingTime < 0) {
      clearInterval(countdownInterval);
      countdownElement.textContent = "When Moon - soon...";
    }
  }, 1000);
}

function displayHalvingDateInTimezones(secondsUntilHalving) {
  const now = new Date();
  const halvingDate = new Date(now.getTime() + secondsUntilHalving * 1000);

  const timeZones = [
    { label: 'MEZ', timeZone: 'Europe/Vienna' }
  ];

  timeZones.forEach(zone => {
    const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: zone.timeZone, timeZoneName: 'short'
    });

    const formattedDate = dateTimeFormat.format(halvingDate);
    document.getElementById(`halvingDate-${zone.timeZone.replace(/[\/\s:]+/g, '-')}`).textContent = `${zone.label}: ${formattedDate}`;
  });
}

function displayDefaultHalvingDateInTimezones(secondsUntilHalving) {
  const now = new Date();
  const halvingDate = new Date(now.getTime() + secondsUntilHalving * 1000);

  const timeZones = [
    { label: 'MEZ', timeZone: 'Europe/Vienna' }
  ];

  timeZones.forEach(zone => {
    const dateTimeFormat = new Intl.DateTimeFormat('de-DE', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric', timeZone: zone.timeZone, timeZoneName: 'short'
    });

    const formattedDate = dateTimeFormat.format(halvingDate);
    document.getElementById(`defaultHalvingDate-${zone.timeZone.replace(/[\/\s:]+/g, '-')}`).textContent = `${zone.label}: ${formattedDate}`;
  });
}

fetchData();
setInterval(fetchData, updateInterval);
