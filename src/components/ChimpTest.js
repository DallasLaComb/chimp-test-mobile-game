import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');
const BLOCK_SIZE = 60;
const HEADER_HEIGHT = 120;
const BOTTOM_MARGIN = 150;

export default function ChimpTest({ onBack }) {
  const [level, setLevel] = useState(5);
  const [blocks, setBlocks] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, gameOver
  const [currentNumber, setCurrentNumber] = useState(1);
  const [showNumbers, setShowNumbers] = useState(true);

  useEffect(() => {
    generateBlocks();
  }, [level]);

  function generateBlocks() {
    const newBlocks = [];
    
    const gameWidth = width - 40;
    const gameHeight = height - HEADER_HEIGHT - BOTTOM_MARGIN;
    
    // Create grid
    const cols = Math.floor(gameWidth / (BLOCK_SIZE + 10));
    const rows = Math.floor(gameHeight / (BLOCK_SIZE + 10));
    
    // Create array of all available positions
    const availablePositions = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        availablePositions.push({ row, col });
      }
    }
    
    // Shuffle and take first 'level' positions
    for (let i = availablePositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
    }
    
    for (let i = 1; i <= level; i++) {
      const position = availablePositions[i - 1];
      const x = position.col * (BLOCK_SIZE + 10) + 20;
      const y = position.row * (BLOCK_SIZE + 10) + HEADER_HEIGHT;
      
      newBlocks.push({
        id: i,
        number: i,
        x: x,
        y: y,
        clicked: false
      });
    }
    
    setBlocks(newBlocks);
    setCurrentNumber(1);
    setShowNumbers(true);
    setGameState('ready');
  }

  function handleBlockPress(block) {
    if (gameState !== 'playing' && gameState !== 'ready') return;
    
    if (gameState === 'ready') {
      setGameState('playing');
      setShowNumbers(false);
    }
    
    if (block.number === currentNumber) {
      const updatedBlocks = blocks.map(b => 
        b.id === block.id ? { ...b, clicked: true } : b
      );
      setBlocks(updatedBlocks);
      
      if (currentNumber === level) {
        // Level complete
        if (level >= 50) {
          Alert.alert('Amazing!', 'You reached level 50!', [
            { text: 'Play Again', onPress: resetGame }
          ]);
        } else {
          setTimeout(() => {
            setLevel(level + 1);
          }, 500);
        }
      } else {
        setCurrentNumber(currentNumber + 1);
      }
    } else {
      // Game over
      setGameState('gameOver');
      Alert.alert('Game Over', `You reached level ${level}!`, [
        { text: 'Play Again', onPress: resetGame }
      ]);
    }
  }

  function resetGame() {
    setLevel(5);
    setGameState('ready');
    setCurrentNumber(1);
    setShowNumbers(true);
    generateBlocks();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.levelText}>Level {level}</Text>
      </View>

      <View style={styles.gameArea}>
        {blocks.map(block => (
          <TouchableOpacity
            key={block.id}
            testID={`block-${block.number}`}
            style={[
              styles.block,
              {
                left: block.x,
                top: block.y,
                backgroundColor: block.clicked ? '#ccc' : '#007AFF'
              }
            ]}
            onPress={() => handleBlockPress(block)}
            disabled={block.clicked}
          >
            <Text style={styles.blockText}>
              {showNumbers || block.clicked ? block.number : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  levelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  block: {
    position: 'absolute',
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});