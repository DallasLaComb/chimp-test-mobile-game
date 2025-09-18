import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '../lib/supabase';
import ChimpTest from './ChimpTest';

export default function GameMenu({ session }) {
  const [currentScreen, setCurrentScreen] = useState('menu');

  async function signOut() {
    await supabase.auth.signOut();
  }

  function startSinglePlayer() {
    setCurrentScreen('singlePlayer');
  }

  function startMultiplayer() {
    console.log('Starting multiplayer mode');
  }

  function backToMenu() {
    setCurrentScreen('menu');
  }

  if (currentScreen === 'singlePlayer') {
    return <ChimpTest onBack={backToMenu} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chimp Test</Text>
        <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gameMenu}>

        
        <TouchableOpacity 
          style={styles.gameButton} 
          onPress={startSinglePlayer}
        >
          <Text style={styles.gameButtonText}>Single Player</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.gameButton, styles.multiplayerButton]} 
          onPress={startMultiplayer}
        >
          <Text style={styles.gameButtonText}>Multiplayer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 8,
    borderRadius: 6,
  },
  signOutText: {
    color: 'white',
    fontSize: 14,
  },
  gameMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 60,
    textAlign: 'center',
  },
  gameButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginBottom: 20,
    minWidth: 200,
  },
  multiplayerButton: {
    backgroundColor: '#34C759',
  },
  gameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});